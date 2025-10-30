import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../config/prisma.service';
import { RegisterInput, LoginInput } from '../inputs';
import { JwtUtil } from '../../../common/utils/jwt.util';

@Injectable()
export class AuthOperations {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = JwtUtil.generateAccessToken(
      payload,
      this.configService.get<string>('jwt.secret') || 'default-secret',
    );
    const refreshToken = JwtUtil.generateRefreshToken(
      payload,
      this.configService.get<string>('jwt.secret') || 'default-secret',
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = JwtUtil.generateAccessToken(
      payload,
      this.configService.get<string>('jwt.secret') || 'default-secret',
    );
    const refreshToken = JwtUtil.generateRefreshToken(
      payload,
      this.configService.get<string>('jwt.secret') || 'default-secret',
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = JwtUtil.verifyToken(
        refreshToken,
        this.configService.get<string>('jwt.secret') || 'default-secret',
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const newAccessToken = JwtUtil.generateAccessToken(
        newPayload,
        this.configService.get('jwt.secret'),
      );

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
