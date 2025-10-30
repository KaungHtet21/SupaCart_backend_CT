import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class CreatePersonalTrainerInput {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsNumber()
  @Min(0)
  hourlyRate: number;
}

export class UpdatePersonalTrainerInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreatePersonalTrainingSessionInput {
  @IsString()
  trainerId: string;

  @IsString()
  sessionDate: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePersonalTrainingSessionInput {
  @IsOptional()
  @IsString()
  sessionDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
