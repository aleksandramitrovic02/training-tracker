import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { Exercise } from '../../exercises/exercises.models';
import { Workout } from '../workouts.models';

export interface WorkoutDialogData {
  mode: 'create' | 'edit';
  exercises: Exercise[];
  workout?: Workout;
}

@Component({
  standalone: true,
  selector: 'app-workout-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Dodaj trening' : 'Izmeni trening' }}</h2>

    <div mat-dialog-content>
      <form [formGroup]="form" class="grid">

        <mat-form-field appearance="outline" class="full">
          <mat-label>Vežba</mat-label>
          <mat-select formControlName="exerciseId">
            <mat-option *ngFor="let e of data.exercises" [value]="e.id">
              {{ e.name }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="form.controls.exerciseId.invalid && form.controls.exerciseId.touched">
            Izaberi vežbu.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Trajanje (min)</mat-label>
          <input matInput type="number" formControlName="durationMinutes" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Kalorije</mat-label>
          <input matInput type="number" formControlName="caloriesBurned" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Intenzitet (1-10)</mat-label>
          <input matInput type="number" formControlName="intensity" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Umor (1-10)</mat-label>
          <input matInput type="number" formControlName="fatigue" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Datum</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="date" />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Vreme (HH:mm)</mat-label>
          <input matInput placeholder="18:30" formControlName="time" />
          <mat-hint>Format: 09:05, 18:30</mat-hint>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Beleške</mat-label>
          <textarea matInput rows="3" formControlName="notes"></textarea>
        </mat-form-field>

      </form>
    </div>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Otkaži</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">
        Sačuvaj
      </button>
    </div>
  `,
  styles: [`
    .grid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 6px;
    }
    .full{ grid-column: 1 / -1; }
    @media (max-width: 700px){
      .grid{ grid-template-columns: 1fr; }
    }
  `]
})
export class WorkoutDialogComponent {
  form: any;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<WorkoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: WorkoutDialogData
  ) {
    this.form = this.fb.group({
      exerciseId: ['', Validators.required],
      durationMinutes: [30, [Validators.required, Validators.min(1)]],
      caloriesBurned: [0, [Validators.required, Validators.min(0)]],
      intensity: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      fatigue: [5, [Validators.required, Validators.min(1), Validators.max(10)]],
      date: [new Date(), Validators.required],
      time: ['18:00', [Validators.required, Validators.pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)]],
      notes: ['']
    });
    if (data.mode === 'edit' && data.workout) {
      const w = data.workout;
      const dt = new Date(w.workoutDateTime);

      this.form.patchValue({
        exerciseId: w.exerciseId,
        durationMinutes: w.durationMinutes,
        caloriesBurned: w.caloriesBurned,
        intensity: w.intensity,
        fatigue: w.fatigue,
        date: dt,
        time: this.toHHmm(dt),
        notes: w.notes ?? ''
      });
    }
  }

  close() {
    this.ref.close();
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.value;
    const workoutDateTime = this.combineDateTime(v.date!, v.time!);

    this.ref.close({
      exerciseId: v.exerciseId!,
      durationMinutes: Number(v.durationMinutes),
      caloriesBurned: Number(v.caloriesBurned),
      intensity: Number(v.intensity),
      fatigue: Number(v.fatigue),
      notes: (v.notes ?? '').toString(),
      workoutDateTime
    });
  }

  private toHHmm(d: Date) {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private combineDateTime(date: Date, time: string): string {
    const [hh, mm] = time.split(':').map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d.toISOString();
  }
}
