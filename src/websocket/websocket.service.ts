import { Injectable } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';

@Injectable()
export class MarkerService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  updateMarker(markerId: string, isAccepted: boolean) {
    const updateData = {
      markerId: markerId,
      isAccepted: isAccepted,
    };
    this.websocketGateway.sendUpdate(updateData);
  }
}