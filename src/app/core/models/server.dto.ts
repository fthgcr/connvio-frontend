// API'den gelen yanıt için tip tanımı
export interface ServerApiResponse {
    id: number;
    name: string;
    description: string;
    ownerUsername: string;
    memberCount: number;
}

// Uygulama içinde kullanılacak tip tanımı
export interface ServerResponse extends ServerApiResponse {
    createdAt: string;
    updatedAt: string;
}

export interface CreateServerRequest {
    name: string;
    description?: string;
}

export interface UpdateServerRequest {
    name?: string;
    description?: string;
} 