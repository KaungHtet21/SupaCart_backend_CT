import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../config/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminOperations {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalMembers,
      activeMemberships,
      pendingMemberships,
      expiredMemberships,
      totalCheckIns,
      todayCheckIns,
    ] = await Promise.all([
      this.prisma.user.count({
        where: { role: 'MEMBER' },
      }),
      this.prisma.membership.count({
        where: { status: 'ACTIVE' },
      }),
      this.prisma.membership.count({
        where: { status: 'PENDING' },
      }),
      this.prisma.membership.count({
        where: { status: 'EXPIRED' },
      }),
      this.prisma.checkIn.count(),
      this.prisma.checkIn.count({
        where: {
          checkInTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

    const memberships = await this.prisma.membership.findMany({
      where: { paymentStatus: 'APPROVED' },
      include: { package: true },
    });

    const totalRevenue = memberships.reduce((sum, membership) => sum + membership.package.price, 0);

    const currentMonth = new Date();
    currentMonth.setDate(1);
    const monthlyMemberships = await this.prisma.membership.findMany({
      where: {
        paymentStatus: 'APPROVED',
        createdAt: { gte: currentMonth },
      },
      include: { package: true },
    });

    const monthlyRevenue = monthlyMemberships.reduce((sum, membership) => sum + membership.package.price, 0);

    return {
      totalMembers,
      activeMemberships,
      pendingMemberships,
      expiredMemberships,
      totalCheckIns,
      todayCheckIns,
      totalRevenue,
      monthlyRevenue,
    };
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        memberships: {
          include: { package: true },
        },
        checkIns: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: { package: true },
        },
        checkIns: true,
        notifications: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: role as UserRole },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
