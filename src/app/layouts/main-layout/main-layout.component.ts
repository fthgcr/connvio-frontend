import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';
import { ServerApiResponse } from '../../core/models/server.dto';
import { Channel } from '../../core/models/channel.dto';
import { ServerMember } from '../../core/models/member.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateServerDialogComponent } from '../../components/create-server-dialog/create-server-dialog.component';
import { CreateChannelDialogComponent } from '../../components/create-channel-dialog/create-channel-dialog.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  providers: [DialogService, MessageService],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  servers: ServerApiResponse[] = [];
  selectedServer?: ServerApiResponse;
  selectedServerId?: number;
  selectedChannelId?: number;
  textChannels: Channel[] = [];
  voiceChannels: Channel[] = [];
  serverMembers: ServerMember[] = [];

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadServers();
  }

  loadServers() {
    this.apiService.getUserServers().subscribe({
      next: (servers: ServerApiResponse[]) => {
        this.servers = servers;
        // İlk sunucuyu otomatik seç
        if (servers.length > 0 && !this.selectedServerId) {
          this.selectServer(servers[0]);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.',
            life: 5000
          });
          this.authService.removeToken();
          this.router.navigate(['/login']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Sunucular yüklenirken bir hata oluştu',
            life: 5000
          });
        }
      }
    });
  }

  selectServer(server: ServerApiResponse) {
    this.selectedServer = server;
    this.selectedServerId = server.id;
    this.loadServerDetails();
  }

  loadServerDetails() {
    if (!this.selectedServerId) return;

    // Kanalları yükle
    this.apiService.getServerChannels(this.selectedServerId).subscribe({
      next: (channels: Channel[]) => {
        this.textChannels = channels.filter(c => c.type === 'TEXT');
        this.voiceChannels = channels.filter(c => c.type === 'VOICE');
      },
      error: (error) => {
        console.error('Error loading channels:', error);
      }
    });

    // Üyeleri yükle
    this.apiService.getServerMembers(this.selectedServerId).subscribe({
      next: (members: ServerMember[]) => {
        this.serverMembers = members;
      },
      error: (error) => {
        console.error('Error loading members:', error);
      }
    });
  }

  selectChannel(channel: Channel) {
    this.selectedChannelId = channel.id;
    this.router.navigate(['/app/channels', channel.id]);
  }

  showCreateChannelDialog() {
    if (!this.selectedServer) return;

    const ref = this.dialogService.open(CreateChannelDialogComponent, {
      header: 'Yeni Kanal Oluştur',
      width: '450px',
      data: {
        serverId: this.selectedServer.id
      }
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadServerDetails();
      }
    });
  }

  showCreateServerDialog() {
    const ref = this.dialogService.open(CreateServerDialogComponent, {
      header: 'Yeni Sunucu Oluştur',
      width: '450px',
      closable: true,
      closeOnEscape: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.apiService.createServer(data).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı',
              detail: 'Sunucu başarıyla oluşturuldu',
              life: 3000
            });
            this.loadServers();
          },
          error: (error) => {
            let errorMessage = 'Sunucu oluşturulurken bir hata oluştu';
            
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
    });
  }

  // ... diğer metodlar
} 