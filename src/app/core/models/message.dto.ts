export interface MessageResponse {
    id: number;
    content: string;
    channelId: number;
    senderUsername: string;
    senderAvatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMessageRequest {
    content: string;
}

export interface ChannelMessage {
  id: number;
  content: string;
  sender: string;
  channelId: number;
  createdAt: string;
  updatedAt: string;
} 