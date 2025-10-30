import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonalTrainingSessionDto {
  @ApiProperty()
  @IsString()
  trainerId: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  sessionDate: string;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 'Focus on upper body strength training', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePersonalTrainingSessionDto {
  @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  sessionDate?: string;

  @ApiProperty({ example: 60, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @ApiProperty({ example: 'SCHEDULED', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'Focus on upper body strength training', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class PersonalTrainingSessionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  trainerId: string;

  @ApiProperty()
  sessionDate: Date;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  notes?: string;

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
  trainer?: {
    id: string;
    name: string;
    email: string;
    hourlyRate: number;
  };
}
