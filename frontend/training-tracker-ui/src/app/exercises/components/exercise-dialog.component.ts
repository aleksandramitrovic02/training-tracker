import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export type ExerciseDialogMode = 'create' | 'edit';

export interface ExerciseDialogData {
  mode: ExerciseDialogMode;
  name?: string;
}

@Component({
  standalone: true,
  selector: 'app-exercise-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Dodaj vežbu' : 'Izmeni vežbu' }}</h2>

    <div mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Naziv</mat-label>
          <input matInput formControlName="name" autocomplete="off" />
          <mat-error *ngIf="form.controls.name.invalid && form.controls.name.touched">
            Naziv je obavezan (min 2).
          </mat-error>
        </mat-form-field>
      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Otkaži</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">
        Sačuvaj
      </button>
    </div>
  `,
  styles: [`.full{width:100%;}`]
})
export class ExerciseDialogComponent {
  form: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExerciseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExerciseDialogData
  ) {
    this.form = this.fb.group({
      name: [this.data.name ?? '', [Validators.required, Validators.minLength(2)]],
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.dialogRef.close({ name: this.form.value.name!.trim() });
  }
}
