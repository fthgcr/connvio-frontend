import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../core/services/api.service';
import { MessageResponse } from '../../core/models/message.dto';
import { Subject, takeUntil } from 'rxjs';
import { WebSocketService } from '../../core/services/websocket.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-channel-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextareaModule, ButtonModule],
  templateUrl: './channel-messages.component.html',
  styleUrls: ['./channel-messages.component.scss']
})
export class ChannelMessagesComponent implements OnInit, OnDestroy {
  messages: MessageResponse[] = [];
  newMessage = '';
  channelId?: number;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private webSocketService: WebSocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.channelId = +params['channelId'];
      this.loadMessages();
      this.connectToWebSocket();
    });
  }

  private connectToWebSocket() {
    if (!this.channelId) return;

    this.webSocketService.subscribeToChannel(this.channelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          if (message) {
            this.messages.push(message);
            this.scrollToBottom();
          }
        },
        error: (error) => {
          console.error('WebSocket error:', error);
        }
      });
  }

  sendMessage() {
    if (!this.channelId || !this.newMessage.trim()) return;

    const username = this.authService.getUsername();
    if (!username) return;

    this.webSocketService.sendMessage(
      this.channelId,
      this.newMessage.trim(),
      username
    );
    
    this.newMessage = '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.webSocketService.disconnect();
  }

  loadMessages() {
    if (!this.channelId) return;

    this.apiService.getChannelMessages(this.channelId).subscribe({
      next: (page) => {
        this.messages = page.content;
        this.scrollToBottom();
      },
      error: (error) => {
        console.error('Error loading messages:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Mesajlar yüklenirken bir hata oluştu'
        });
      }
    });
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const messagesList = document.querySelector('.messages-list');
      if (messagesList) {
        messagesList.scrollTop = messagesList.scrollHeight;
      }
    });
  }
} 