import { Injectable } from '@nestjs/common';
import { AuthOperations } from './operations';
import { RegisterInput, LoginInput } from './inputs';

@Injectable()
export class AuthService {
  constructor(private authOperations: AuthOperations) {}

  async register(input: RegisterInput) {
    return this.authOperations.register(input);
  }

  async login(input: LoginInput) {
    return this.authOperations.login(input);
  }

  async refreshToken(refreshToken: string) {
    return this.authOperations.refreshToken(refreshToken);
  }
}
