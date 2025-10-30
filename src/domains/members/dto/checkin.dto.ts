import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({ example: 'MEM-12345678' })
  @IsString()
  memberId: string;

  @ApiProperty({ example: 'Notes about the check-in', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CheckInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  membershipId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  checkInTime: Date;

  @ApiProperty()
  notes?: string;

  @ApiProperty()
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty()
  membership?: {
    id: string;
    status: string;
    endDate?: Date;
  };
}

export class QrInitResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  expiresAt: Date;
}

export class QrSessionResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
