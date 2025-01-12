import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../core/services/api.service';
import { ServerApiResponse } from '../../core/models/server.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateServerDialogComponent } from '../../components/create-server-dialog/create-server-dialog.component';

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
  selectedServerId?: number;

  constructor(
    private apiService: ApiService,
    private dialogService: DialogService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadServers();
  }

  loadServers() {
    this.apiService.getUserServers().subscribe({
      next: (servers: ServerApiResponse[]) => {
        this.servers = servers;
      },
      error: (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Sunucular yüklenirken bir hata oluştu'
        });
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

  selectServer(server: any) {
    this.selectedServerId = server.id;
    this.router.navigate(['/servers', server.id]);
  }
} 