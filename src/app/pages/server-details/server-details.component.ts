import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ServerResponse, ServerApiResponse } from '../../core/models/server.dto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-details',
  templateUrl: './server-details.component.html',
  styleUrls: ['./server-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ServerDetailsComponent implements OnInit {
  server: ServerResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const serverId = this.route.snapshot.paramMap.get('id');
    if (serverId) {
      this.loadServerDetails(serverId);
    }
  }

  loadServerDetails(serverId: string) {
    console.log(`Loading details for server ID: ${serverId}`);
    this.apiService.getServerDetails(serverId).subscribe({
      next: (response: ServerApiResponse) => {
        console.log('Server details response:', response);
        this.server = {
          ...response,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      },
      error: (error) => {
        console.error('Error loading server details:', error);
      }
    });
  }
} 