import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToAdmins(event: string, data: any) {
    this.server.to('admins').emit(event, data);
  }

  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  async joinUserRoom(socket: Socket, userId: string) {
    await socket.join(`user:${userId}`);
  }

  async joinAdminRoom(socket: Socket) {
    await socket.join('admins');
  }

  async leaveUserRoom(socket: Socket, userId: string) {
    await socket.leave(`user:${userId}`);
  }

  async leaveAdminRoom(socket: Socket) {
    await socket.leave('admins');
  }
}
