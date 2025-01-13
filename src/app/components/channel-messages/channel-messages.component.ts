import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ChannelMessage } from '../../core/models/message.dto';
import { Page } from '../../core/models/page.dto';

@Component({
  selector: 'app-channel-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="messages-container">
      <div *ngFor="let message of messages" class="message">
        <div class="message-header">
          <span class="sender">{{ message.sender }}</span>
          <span class="timestamp">{{ message.createdAt | date:'short' }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
      </div>
    </div>
  `,
  styles: [`
    .messages-container {
      padding: 1rem;
    }
    .message {
      margin-bottom: 1rem;
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .sender {
      font-weight: bold;
    }
    .timestamp {
      color: #666;
      font-size: 0.9em;
    }
  `]
})
export class ChannelMessagesComponent implements OnInit {
  messages: ChannelMessage[] = [];
  channelId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.channelId = +params['id'];
      this.loadMessages();
    });
  }

  loadMessages() {
    this.apiService.getChannelMessages(this.channelId).subscribe({
      next: (page: Page<ChannelMessage>) => {
        this.messages = page.content;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }
} 