import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { PrismaService } from './config/prisma.service';
import { RedisModule } from './infrastructure/redis/redis.module';
import { SocketModule } from './infrastructure/websocket/socket.module';
import { AuthModule } from './domains/auth/auth.module';
import { MembersModule } from './domains/members/members.module';
import { AdminModule } from './domains/admin/admin.module';
import { NotificationsModule } from './domains/notifications/notifications.module';
import { PersonalTrainersModule } from './domains/personal-trainers/personal-trainers.module';
import { LogMiddleware } from './middlewares/logs.middleware';
import { throttlerOptions } from './middlewares/configure-rate-limit';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerOptions),
    ConfigModule,
    RedisModule,
    SocketModule,
    AuthModule,
    MembersModule,
    AdminModule,
    NotificationsModule,
    PersonalTrainersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
