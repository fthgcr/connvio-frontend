import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-create-server-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule
  ],
  templateUrl: './create-server-dialog.component.html',
  styleUrls: ['./create-server-dialog.component.scss']
})
export class CreateServerDialogComponent {
  serverForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef
  ) {
    this.serverForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', Validators.maxLength(1000)]
    });
  }

  onSubmit() {
    if (this.serverForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.ref.close(this.serverForm.value);
    }
  }

  close() {
    this.ref.close();
  }

  get nameErrors() {
    const control = this.serverForm.get('name');
    if (control?.touched && control.invalid) {
      if (control.errors?.['required']) {
        return 'Sunucu adı gereklidir';
      }
      if (control.errors?.['minlength']) {
        return 'Sunucu adı en az 3 karakter olmalıdır';
      }
      if (control.errors?.['maxlength']) {
        return 'Sunucu adı en fazla 50 karakter olmalıdır';
      }
    }
    return null;
  }
} 