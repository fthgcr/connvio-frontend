import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.scss']
})
export class EditServerComponent implements OnInit {
  serverForm: FormGroup;
  serverId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.serverForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.serverId = this.route.snapshot.paramMap.get('id');
    if (this.serverId) {
      this.loadServerDetails(this.serverId);
    }
  }

  loadServerDetails(serverId: string) {
    this.apiService.getServerDetails(serverId).subscribe({
      next: (response) => {
        this.serverForm.patchValue({
          name: response.name,
          description: response.description
        });
      },
      error: (error) => {
        console.error('Error loading server details:', error);
      }
    });
  }

  onSubmit() {
    if (this.serverForm.valid) {
      this.apiService.updateServer(this.serverId, this.serverForm.value).subscribe({
        next: () => {
          this.router.navigate(['/servers', this.serverId]);
        },
        error: (error) => {
          console.error('Error updating server:', error);
        }
      });
    }
  }
} 