import { Module } from '@nestjs/common';
import { PersonalTrainersController } from './personal-trainers.controller';
import { PersonalTrainersService } from './personal-trainers.service';
import { PersonalTrainerOperations } from './operations';
import { PrismaService } from '../../config/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PersonalTrainersController],
  providers: [PersonalTrainersService, PersonalTrainerOperations, PrismaService],
  exports: [PersonalTrainersService],
})
export class PersonalTrainersModule {}
