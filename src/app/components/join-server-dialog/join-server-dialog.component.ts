import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-join-server-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
  template: `
    <div class="join-dialog">
      <div class="p-fluid">
        <div class="p-field">
          <label for="inviteCode">Davet Kodu</label>
          <input 
            id="inviteCode" 
            type="text" 
            pInputText 
            [(ngModel)]="inviteCode" 
            placeholder="XXXX-XXXX">
        </div>
        <p-button 
          label="Katıl" 
          [disabled]="!inviteCode" 
          (onClick)="joinServer()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
    .join-dialog {
      padding: 1rem;
    }
    .p-field {
      margin-bottom: 1rem;
    }
  `]
})
export class JoinServerDialogComponent {
  inviteCode: string = '';

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private router: Router
  ) {}

  joinServer() {
    if (!this.inviteCode) return;

    this.apiService.joinServerWithInvite(this.inviteCode).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: `${response.serverName} sunucusuna katıldınız`
        });
        this.dialogRef.close(true);
        // Sunucu listesini yenilemek için ana sayfaya yönlendir
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Sunucuya katılırken bir hata oluştu'
        });
      }
    });
  }
} 