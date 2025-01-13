import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageResponse } from '../models/message.dto';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private messageSubject = new BehaviorSubject<MessageResponse | null>(null);

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      debug: (str: string) => {
        console.log(str);
      }
    });

    this.client.onConnect = () => {
      console.log('Connected to WebSocket');
    };

    this.client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
    };

    this.client.activate();
  }

  subscribeToChannel(channelId: number): Observable<MessageResponse> {
    this.client.subscribe(`/topic/channel/${channelId}`, (message: Message) => {
      const messageData = JSON.parse(message.body);
      this.messageSubject.next(messageData);
    });

    return this.messageSubject.asObservable().pipe(
      filter((message): message is MessageResponse => message !== null)
    );
  }

  sendMessage(channelId: number, content: string, username: string): void {
    if (this.client.connected) {
      this.client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify({
          type: 'CHAT',
          content: content,
          sender: username,
          channelId: channelId
        })
      });
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
    }
  }
} 