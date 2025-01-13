export interface Channel {
    id: number;
    name: string;
    type: 'TEXT' | 'VOICE';
    serverId: number;
    createdAt: string;
    updatedAt: string;
} 