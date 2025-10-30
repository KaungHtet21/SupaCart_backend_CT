import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMembershipDto {
  @ApiProperty()
  @IsUUID()
  packageId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentScreenshot?: string;
}

export class UpdateMembershipStatusDto {
  @ApiProperty({ enum: ['PENDING', 'ACTIVE', 'EXPIRED', 'SUSPENDED'] })
  @IsString()
  status: string;

  @ApiProperty({ enum: ['PENDING', 'APPROVED', 'REJECTED'] })
  @IsString()
  paymentStatus: string;
}

export class MembershipResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  packageId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  paymentStatus: string;

  @ApiProperty()
  paymentScreenshot?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty()
  package?: {
    id: string;
    title: string;
    price: number;
    durationDays: number;
  };
}
