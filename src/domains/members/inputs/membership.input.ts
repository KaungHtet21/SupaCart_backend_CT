import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateMembershipPackageInput {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  durationDays: number;
}

export class UpdateMembershipPackageInput {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationDays?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMembershipInput {
  @IsString()
  packageId: string;

  @IsOptional()
  @IsString()
  paymentScreenshot?: string;
}

export class UpdateMembershipStatusInput {
  @IsString()
  status: string;

  @IsString()
  paymentStatus: string;
}

export class CheckInInput {
  @IsString()
  memberId: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class QrDecisionInput {
  @IsBoolean()
  approve: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}
