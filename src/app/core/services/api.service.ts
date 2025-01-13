import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServerInviteResponse } from '../models/server-invite.dto';
import { Channel } from '../models/channel.dto';
import { ServerMember } from '../models/member.dto';
import { ServerApiResponse } from '../models/server.dto';
import { LoginResponse, LoginRequest, RegisterRequest, AuthResponse } from '../models/auth.dto';
import { ChannelMessage } from '../models/message.dto';
import { CreateChannelRequest } from '../models/channel.dto';
import { Page } from '../models/page.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth işlemleri
  loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login`, 
      loginRequest,
      { headers }
    );
  }

  registerUser(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  // Sunucu işlemleri
  getUserServers(): Observable<ServerApiResponse[]> {
    return this.http.get<ServerApiResponse[]>(`${this.apiUrl}/servers`);
  }

  createServer(serverData: any): Observable<ServerApiResponse> {
    return this.http.post<ServerApiResponse>(`${this.apiUrl}/servers`, serverData);
  }

  getServerChannels(serverId: number): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/servers/${serverId}/channels`);
  }

  getServerMembers(serverId: number): Observable<ServerMember[]> {
    return this.http.get<ServerMember[]>(`${this.apiUrl}/servers/${serverId}/members`);
  }

  // Kanal işlemleri
  createChannel(serverId: number, channelData: CreateChannelRequest): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/servers/${serverId}/channels`, channelData);
  }

  getChannelMessages(channelId: number): Observable<Page<ChannelMessage>> {
    return this.http.get<Page<ChannelMessage>>(`${this.apiUrl}/channels/${channelId}/messages`);
  }

  // Davet işlemleri
  createServerInvite(serverId: number): Observable<ServerInviteResponse> {
    return this.http.post<ServerInviteResponse>(`${this.apiUrl}/servers/${serverId}/invites`, {});
  }

  joinServerWithInvite(inviteCode: string): Observable<ServerInviteResponse> {
    return this.http.post<ServerInviteResponse>(`${this.apiUrl}/servers/join/${inviteCode}`, {});
  }
} 