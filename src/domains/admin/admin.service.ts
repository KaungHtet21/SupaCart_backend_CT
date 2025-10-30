import { Injectable } from '@nestjs/common';
import { AdminOperations } from './operations';

@Injectable()
export class AdminService {
  constructor(private adminOperations: AdminOperations) {}

  async getDashboardStats() {
    return this.adminOperations.getDashboardStats();
  }

  async getAllUsers() {
    return this.adminOperations.getAllUsers();
  }

  async getUserById(id: string) {
    return this.adminOperations.getUserById(id);
  }

  async updateUserRole(id: string, role: string) {
    return this.adminOperations.updateUserRole(id, role);
  }

  async deleteUser(id: string) {
    return this.adminOperations.deleteUser(id);
  }
}
