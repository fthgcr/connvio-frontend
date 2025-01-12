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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
} 