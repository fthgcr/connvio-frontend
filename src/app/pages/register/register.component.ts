import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthResponse } from '../../core/models/auth.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    RouterLink, 
    ToastModule,
    CommonModule
  ],
  providers: [MessageService]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private apiService: ApiService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.messageService.clear();
    
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.apiService.registerUser(this.registerForm.value).subscribe({
        next: (response: AuthResponse) => {
          localStorage.setItem('token', response.token);
          
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Kayıt işlemi başarıyla tamamlandı.',
            life: 3000,
            closable: true,
            styleClass: 'custom-toast'
          });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error: HttpErrorResponse) => {
          let errorMessage = 'Bir hata oluştu';
          
          if (error.error?.turkishMessage) {
            errorMessage = error.error.turkishMessage;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: errorMessage,
            life: 5000,
            closable: true,
            styleClass: 'custom-toast'
          });
        }
      });
    }
  }
} 