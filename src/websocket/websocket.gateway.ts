import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;

  sendUpdate(updateData: {
    markerId: string,
    isAccepted: boolean,
  }) {
    this.server.emit('update-marker', updateData);
  }

  @SubscribeMessage('click-event')
  handleClientEvent(@MessageBody() message: any) {
    console.log('Message reçu du client:', message);
  }
}
