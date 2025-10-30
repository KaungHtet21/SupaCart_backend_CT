import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonalTrainerDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@trainer.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: ['Weight Training', 'Cardio', 'Nutrition'] })
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({ example: 'Certified personal trainer with 10+ years experience', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 75.0 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;
}

export class UpdatePersonalTrainerDto {
  @ApiProperty({ example: 'John Smith', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: ['Weight Training', 'Cardio', 'Nutrition'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[];

  @ApiProperty({ example: 'Certified personal trainer with 10+ years experience', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 75.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class PersonalTrainerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  specialties: string[];

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  hourlyRate: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
