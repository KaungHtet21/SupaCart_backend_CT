import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { R2Service } from '../../../infrastructure/r2/r2.service';
import { 
  CreateMembershipPackageInput, 
  UpdateMembershipPackageInput,
  CreateMembershipInput,
  UpdateMembershipStatusInput,
  CheckInInput 
} from '../inputs';
import { MembershipStatus, PaymentStatus, CheckInStatus } from '../../../common/enums';
import { addDays, isDateExpired } from '../../../common/utils/custom';
import { RedisService } from '../../../infrastructure/redis/redis.service';
import { OneSignalService } from '../../../infrastructure/notifications/onesignal.service';
import { randomBytes } from 'crypto';

@Injectable()
export class MembershipOperations {
  constructor(
    private prisma: PrismaService,
    private r2Service: R2Service,
    private redis: RedisService,
    private push: OneSignalService,
  ) {}

  async createMembershipPackage(input: CreateMembershipPackageInput) {
    return this.prisma.membershipPackage.create({
      data: input,
    });
  }

  async updateMembershipPackage(id: string, input: UpdateMembershipPackageInput) {
    const packageExists = await this.prisma.membershipPackage.findUnique({
      where: { id },
    });

    if (!packageExists) {
      throw new NotFoundException('Membership package not found');
    }

    return this.prisma.membershipPackage.update({
      where: { id },
      data: input,
    });
  }

  async deleteMembershipPackage(id: string) {
    const packageExists = await this.prisma.membershipPackage.findUnique({
      where: { id },
    });

    if (!packageExists) {
      throw new NotFoundException('Membership package not found');
    }

    return this.prisma.membershipPackage.delete({
      where: { id },
    });
  }

  async getAllMembershipPackages() {
    return this.prisma.membershipPackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMembershipPackageById(id: string) {
    const packageData = await this.prisma.membershipPackage.findUnique({
      where: { id },
    });

    if (!packageData) {
      throw new NotFoundException('Membership package not found');
    }

    return packageData;
  }

  async createMembership(userId: string, input: CreateMembershipInput, file?: Express.Multer.File) {
    const packageData = await this.prisma.membershipPackage.findUnique({
      where: { id: input.packageId },
    });

    if (!packageData) {
      throw new NotFoundException('Membership package not found');
    }

    const existingMembership = await this.prisma.membership.findFirst({
      where: {
        userId,
        status: MembershipStatus.ACTIVE,
      },
    });

    if (existingMembership) {
      throw new BadRequestException('User already has an active membership');
    }

    let paymentScreenshotUrl: string | undefined;

    if (file) {
      paymentScreenshotUrl = await this.r2Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
    }

    return this.prisma.membership.create({
      data: {
        userId,
        packageId: input.packageId,
        paymentScreenshot: paymentScreenshotUrl,
        status: MembershipStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      },
    });
  }

  async updateMembershipStatus(id: string, input: UpdateMembershipStatusInput) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: { user: true, package: true },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    const updateData: any = {
      status: input.status,
      paymentStatus: input.paymentStatus,
    };

    if (input.status === MembershipStatus.ACTIVE && input.paymentStatus === PaymentStatus.APPROVED) {
      updateData.startDate = new Date();
      updateData.endDate = addDays(new Date(), membership.package.durationDays);
    }

    const updated = await this.prisma.membership.update({
      where: { id },
      data: updateData,
      include: { user: true, package: true },
    });

    if (
      updated.status === MembershipStatus.ACTIVE &&
      updated.paymentStatus === PaymentStatus.APPROVED
    ) {
      const externalUserId = updated.userId;
      const title = 'Membership Approved';
      const body = `Your ${updated.package.title} membership is now active.`;
      this.push
        .sendToExternalUser(externalUserId, {
          title,
          body,
          data: { membershipId: updated.id, type: 'MEMBERSHIP_APPROVED' },
        })
        .catch(() => {});
    }

    return updated;
  }

  async getUserMemberships(userId: string) {
    return this.prisma.membership.findMany({
      where: { userId },
      include: { package: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllMemberships() {
    return this.prisma.membership.findMany({
      include: { user: true, package: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMembershipById(id: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { id },
      include: { user: true, package: true },
    });

    if (!membership) {
      throw new NotFoundException('Membership not found');
    }

    return membership;
  }

  async checkIn(input: CheckInInput) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input.memberId },
          { id: input.memberId },
        ],
      },
      include: {
        memberships: {
          where: { status: MembershipStatus.ACTIVE },
          include: { package: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Member not found');
    }

    const activeMembership = user.memberships[0];

    if (!activeMembership) {
      throw new BadRequestException('No active membership found');
    }

    if (activeMembership.endDate && isDateExpired(activeMembership.endDate)) {
      await this.prisma.membership.update({
        where: { id: activeMembership.id },
        data: { status: MembershipStatus.EXPIRED },
      });

      throw new BadRequestException('Membership has expired');
    }

    const checkIn = await this.prisma.checkIn.create({
      data: {
        userId: user.id,
        membershipId: activeMembership.id,
        status: CheckInStatus.ALLOWED,
        notes: input.notes,
      },
      include: { user: true, membership: true },
    });

    return checkIn;
  }

  async createQrSession(userId: string, baseUrl: string) {
    const token = randomBytes(16).toString('hex');
    const ttl = 180; // seconds
    const key = `qr:checkin:${token}`;
    const payload = JSON.stringify({ userId, exp: Date.now() + ttl * 1000 });
    await this.redis.set(key, payload, ttl);
    return {
      token,
      url: `${baseUrl.replace(/\/$/, '')}/qr/checkin/${token}`,
      expiresAt: new Date(Date.now() + ttl * 1000),
    };
  }

  async getQrSession(token: string) {
    const key = `qr:checkin:${token}`;
    const raw = await this.redis.get(key);
    if (!raw) throw new NotFoundException('QR session not found or expired');
    const { userId, exp } = JSON.parse(raw);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return {
      token,
      expiresAt: new Date(exp),
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    };
  }

  async finalizeQrCheckIn(token: string, approve: boolean, notes?: string) {
    const key = `qr:checkin:${token}`;
    const raw = await this.redis.get(key);
    if (!raw) throw new NotFoundException('QR session not found or expired');
    const { userId } = JSON.parse(raw);
    await this.redis.del(key);

    if (!approve) {
      return { status: 'DENIED' };
    }

    return this.checkIn({ memberId: userId, notes });
  }

  async getCheckIns(userId?: string) {
    const where = userId ? { userId } : {};
    
    return this.prisma.checkIn.findMany({
      where,
      include: { user: true, membership: true },
      orderBy: { checkInTime: 'desc' },
    });
  }

  async getCheckInById(id: string) {
    const checkIn = await this.prisma.checkIn.findUnique({
      where: { id },
      include: { user: true, membership: true },
    });

    if (!checkIn) {
      throw new NotFoundException('Check-in record not found');
    }

    return checkIn;
  }
}
