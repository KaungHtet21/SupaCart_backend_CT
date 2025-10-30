import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AuthGuard } from '../../guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private socketService: SocketService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.socketService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_user_room')
  async handleJoinUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    await this.socketService.joinUserRoom(client, data.userId);
    client.emit('joined_room', { room: `user:${data.userId}` });
  }

  @SubscribeMessage('join_admin_room')
  async handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    await this.socketService.joinAdminRoom(client);
    client.emit('joined_room', { room: 'admins' });
  }

  @SubscribeMessage('leave_user_room')
  async handleLeaveUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    await this.socketService.leaveUserRoom(client, data.userId);
    client.emit('left_room', { room: `user:${data.userId}` });
  }

  @SubscribeMessage('leave_admin_room')
  async handleLeaveAdminRoom(@ConnectedSocket() client: Socket) {
    await this.socketService.leaveAdminRoom(client);
    client.emit('left_room', { room: 'admins' });
  }
}
