import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as si from 'systeminformation';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SystemGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server = new Server();
  private logger: Logger = new Logger('SystemGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('get-ram-usage')
  async handleGetRamUsage(@MessageBody() data: any, client: Socket): Promise<void> {
    try {
      const memData = await si.mem();
      this.logger.log(`RAM usage: ${memData.active} / ${memData.free}`);
      this.server.emit('ram-usage', { used: memData.active, free: memData.free });
    } catch (error) {
      this.logger.error('Error fetching RAM data:', error);
    }
  }
}
