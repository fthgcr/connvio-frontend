import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-create-channel-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule
  ],
  template: `
    <form [formGroup]="channelForm" (ngSubmit)="onSubmit()">
      <div class="field">
        <label for="name">Kanal Adı</label>
        <input 
          id="name" 
          type="text" 
          pInputText 
          formControlName="name"
          class="w-full">
        <small class="text-red-500" *ngIf="channelForm.get('name')?.errors?.['required'] && channelForm.get('name')?.touched">
          Kanal adı gereklidir
        </small>
      </div>

      <div class="field">
        <label for="type">Kanal Tipi</label>
        <p-dropdown
          id="type"
          [options]="channelTypes"
          formControlName="type"
          optionLabel="label"
          optionValue="value"
          class="w-full">
        </p-dropdown>
      </div>

      <div class="flex justify-content-end gap-2">
        <p-button 
          label="İptal" 
          (click)="close()" 
          styleClass="p-button-text">
        </p-button>
        <p-button 
          label="Oluştur" 
          type="submit" 
          [disabled]="!channelForm.valid">
        </p-button>
      </div>
    </form>
  `,
  styles: [`
    :host ::ng-deep {
      .field {
        margin-bottom: 1.5rem;
      }
      
      label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
    }
  `]
})
export class CreateChannelDialogComponent implements OnInit {
  channelForm: FormGroup;
  channelTypes = [
    { label: 'Metin Kanalı', value: 'TEXT' },
    { label: 'Ses Kanalı', value: 'VOICE' }
  ];

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private apiService: ApiService
  ) {
    this.channelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['TEXT', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.channelForm.valid && this.config.data?.serverId) {
      const serverId = this.config.data.serverId;
      this.apiService.createChannel(serverId, this.channelForm.value).subscribe({
        next: (response) => {
          this.ref.close(response);
        },
        error: (error) => {
          console.error('Error creating channel:', error);
        }
      });
    }
  }

  close() {
    this.ref.close();
  }
} 