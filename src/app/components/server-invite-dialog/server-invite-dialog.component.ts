import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-server-invite-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule],
  template: `
    <div class="invite-dialog">
      <div *ngIf="!inviteCode" class="loading">
        Davet kodu oluşturuluyor...
      </div>
      <div *ngIf="inviteCode" class="invite-content">
        <h3>Davet Kodu</h3>
        <div class="code-display">
          <input type="text" pInputText [value]="inviteCode" readonly #codeInput>
          <p-button icon="pi pi-copy" (click)="copyCode(codeInput)"></p-button>
        </div>
        <p class="expiry-note">Bu kod 24 saat geçerlidir.</p>
      </div>
    </div>
  `,
  styles: [`
    .invite-dialog {
      padding: 1rem;
    }
    .code-display {
      display: flex;
      gap: 0.5rem;
      margin: 1rem 0;
    }
    .expiry-note {
      color: var(--text-muted);
      font-size: 0.9rem;
    }
  `]
})
export class ServerInviteDialogComponent implements OnInit {
  inviteCode: string = '';

  constructor(
    private config: DynamicDialogConfig,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.generateInvite();
  }

  private generateInvite() {
    const serverId = this.config.data?.serverId;
    if (!serverId) return;

    this.apiService.createServerInvite(serverId).subscribe({
      next: (response) => {
        this.inviteCode = response.code;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Davet kodu oluşturulurken bir hata oluştu'
        });
      }
    });
  }

  copyCode(input: HTMLInputElement) {
    input.select();
    document.execCommand('copy');
    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Davet kodu kopyalandı'
    });
  }
} 