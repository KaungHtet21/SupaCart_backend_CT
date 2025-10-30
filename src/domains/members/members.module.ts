import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { MembershipOperations } from './operations';
import { PrismaService } from '../../config/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { R2Module } from '../../infrastructure/r2/r2.module';
import { RedisModule } from '../../infrastructure/redis/redis.module';
import { OneSignalService } from '../../infrastructure/notifications/onesignal.service';

@Module({
  imports: [AuthModule, R2Module, RedisModule],
  controllers: [MembersController],
  providers: [MembersService, MembershipOperations, PrismaService, OneSignalService],
  exports: [MembersService],
})
export class MembersModule {}
