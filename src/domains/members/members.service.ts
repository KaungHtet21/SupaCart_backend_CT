import { Injectable } from '@nestjs/common';
import { MembershipOperations } from './operations';
import { 
  CreateMembershipPackageInput, 
  UpdateMembershipPackageInput,
  CreateMembershipInput,
  UpdateMembershipStatusInput,
  CheckInInput 
} from './inputs';

@Injectable()
export class MembersService {
  constructor(private membershipOperations: MembershipOperations) {}

  // Membership Package methods
  async createMembershipPackage(input: CreateMembershipPackageInput) {
    return this.membershipOperations.createMembershipPackage(input);
  }

  async updateMembershipPackage(id: string, input: UpdateMembershipPackageInput) {
    return this.membershipOperations.updateMembershipPackage(id, input);
  }

  async deleteMembershipPackage(id: string) {
    return this.membershipOperations.deleteMembershipPackage(id);
  }

  async getAllMembershipPackages() {
    return this.membershipOperations.getAllMembershipPackages();
  }

  async getMembershipPackageById(id: string) {
    return this.membershipOperations.getMembershipPackageById(id);
  }

  // Membership methods
  async createMembership(userId: string, input: CreateMembershipInput, file?: Express.Multer.File) {
    return this.membershipOperations.createMembership(userId, input, file);
  }

  async updateMembershipStatus(id: string, input: UpdateMembershipStatusInput) {
    return this.membershipOperations.updateMembershipStatus(id, input);
  }

  async getUserMemberships(userId: string) {
    return this.membershipOperations.getUserMemberships(userId);
  }

  async getAllMemberships() {
    return this.membershipOperations.getAllMemberships();
  }

  async getMembershipById(id: string) {
    return this.membershipOperations.getMembershipById(id);
  }

  // Check-in methods
  async checkIn(input: CheckInInput) {
    return this.membershipOperations.checkIn(input);
  }

  async getCheckIns(userId?: string) {
    return this.membershipOperations.getCheckIns(userId);
  }

  async getCheckInById(id: string) {
    return this.membershipOperations.getCheckInById(id);
  }

  // QR Check-in
  async createQrSession(userId: string, baseUrl: string) {
    return this.membershipOperations.createQrSession(userId, baseUrl);
  }

  async getQrSession(token: string) {
    return this.membershipOperations.getQrSession(token);
  }

  async finalizeQrCheckIn(token: string, approve: boolean, notes?: string) {
    return this.membershipOperations.finalizeQrCheckIn(token, approve, notes);
  }
}
