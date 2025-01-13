export interface ServerMember {
    id: number;
    username: string;
    avatarUrl?: string;
    status: 'ONLINE' | 'OFFLINE' | 'IDLE' | 'DO_NOT_DISTURB';
} 