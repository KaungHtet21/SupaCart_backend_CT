import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationInput {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  type: string;
}

export class UpdateNotificationInput {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
