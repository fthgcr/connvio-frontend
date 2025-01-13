import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  ServerApiResponse, 
  CreateServerRequest, 
  UpdateServerRequest 
} from '../models/server.dto';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse
} from '../models/auth.dto';
import { Channel } from '../models/channel.dto';
import { ServerMember } from '../models/member.dto';
import { MessageResponse, CreateMessageRequest } from '../models/message.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  registerUser(user: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/register`, user)
      .pipe(catchError(this.handleError));
  }

  loginUser(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/users/login`, credentials)
      .pipe(catchError(this.handleError));
  }

  // Server endpoints
  getUserServers(): Observable<ServerApiResponse[]> {
    return this.http.get<ServerApiResponse[]>(`${this.apiUrl}/servers`)
      .pipe(catchError(this.handleError));
  }

  getServerDetails(serverId: string): Observable<ServerApiResponse> {
    return this.http.get<ServerApiResponse>(`${this.apiUrl}/servers/${serverId}`)
      .pipe(catchError(this.handleError));
  }

  createServer(data: CreateServerRequest): Observable<ServerApiResponse> {
    return this.http.post<ServerApiResponse>(`${this.apiUrl}/servers`, data)
      .pipe(catchError(this.handleError));
  }

  updateServer(serverId: string, data: UpdateServerRequest): Observable<ServerApiResponse> {
    return this.http.put<ServerApiResponse>(`${this.apiUrl}/servers/${serverId}`, data)
      .pipe(catchError(this.handleError));
  }

  getServerChannels(serverId: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${environment.apiUrl}/servers/${serverId}/channels`);
  }

  getServerMembers(serverId: number): Observable<ServerMember[]> {
    return this.http.get<ServerMember[]>(`${environment.apiUrl}/servers/${serverId}/members`);
  }

  createChannel(serverId: number, data: { name: string, type: 'TEXT' | 'VOICE' }): Observable<Channel> {
    return this.http.post<Channel>(`${environment.apiUrl}/servers/${serverId}/channels`, data);
  }

  getChannelMessages(channelId: number, page: number = 0, size: number = 50): Observable<Page<MessageResponse>> {
    return this.http.get<Page<MessageResponse>>(
      `${environment.apiUrl}/channels/${channelId}/messages?page=${page}&size=${size}&sort=createdAt,desc`
    );
  }

  createMessage(channelId: number, request: CreateMessageRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(
      `${environment.apiUrl}/channels/${channelId}/messages`,
      request
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
} 