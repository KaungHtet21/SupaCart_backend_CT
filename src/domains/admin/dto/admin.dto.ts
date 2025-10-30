import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsDto {
  @ApiProperty()
  totalMembers: number;

  @ApiProperty()
  activeMemberships: number;

  @ApiProperty()
  pendingMemberships: number;

  @ApiProperty()
  expiredMemberships: number;

  @ApiProperty()
  totalCheckIns: number;

  @ApiProperty()
  todayCheckIns: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  monthlyRevenue: number;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  memberships?: any[];

  @ApiProperty()
  checkIns?: any[];
}
