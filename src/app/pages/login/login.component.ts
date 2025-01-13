import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthResponse } from '../../core/models/auth.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    ToastModule,
    CommonModule
  ],
  providers: [MessageService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.loginUser(this.loginForm.value).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login response:', response);
          if (response.token) {
            this.authService.setToken(response.token);
            console.log('Stored token:', localStorage.getItem('token'));
            
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı',
              detail: 'Giriş başarılı!',
              life: 2000
            });
            
            setTimeout(() => {
              this.router.navigate(['/app']);
            }, 2000);
          } else {
            console.error('No token in response');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          let errorMessage = 'Giriş başarısız';
          if (error.error?.turkishMessage) {
            errorMessage = error.error.turkishMessage;
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    }
  }
} 