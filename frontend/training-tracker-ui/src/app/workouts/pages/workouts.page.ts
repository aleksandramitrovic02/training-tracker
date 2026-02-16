import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { WorkoutsService } from '../../core/services/workouts.service';
import { Workout, ExerciseType } from '../workouts.models';
import { WorkoutDialogComponent } from '../components/workou-dialog.component';

@Component({
  standalone: true,
  selector: 'app-workouts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  template: `
    <div class="pageHeader">
      <div class="headerContent">
        <mat-icon class="headerIcon">fitness_center</mat-icon>
        <div>
          <h2>Workouts</h2>
          <p class="subtitle">Add and track your workouts</p>
        </div>
      </div>
      <button mat-raised-button class="addBtn" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Add workout
      </button>
    </div>

    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="loader"></mat-progress-bar>

    <div class="tableCard" *ngIf="!loading">
      <table mat-table [dataSource]="items" *ngIf="items.length > 0">

        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let row">{{ row.workoutDateTime | date:'dd.MM.yyyy HH:mm' }}</td>
        </ng-container>

        <ng-container matColumnDef="exercise">
          <th mat-header-cell *matHeaderCellDef>Exercise</th>
          <td mat-cell *matCellDef="let row">{{ getExerciseTypeName(row.exerciseType) }}</td>
        </ng-container>

        <ng-container matColumnDef="duration">
          <th mat-header-cell *matHeaderCellDef>Min</th>
          <td mat-cell *matCellDef="let row">{{ row.durationMinutes }}</td>
        </ng-container>

        <ng-container matColumnDef="calories">
          <th mat-header-cell *matHeaderCellDef>kcal</th>
          <td mat-cell *matCellDef="let row">{{ row.caloriesBurned }}</td>
        </ng-container>

        <ng-container matColumnDef="intensity">
          <th mat-header-cell *matHeaderCellDef>Int</th>
          <td mat-cell *matCellDef="let row">{{ row.intensity }}</td>
        </ng-container>

        <ng-container matColumnDef="fatigue">
          <th mat-header-cell *matHeaderCellDef>Fatigue</th>
          <td mat-cell *matCellDef="let row">{{ row.fatigue }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:160px">Actions</th>
          <td mat-cell *matCellDef="let row" class="actions">
            <button mat-icon-button (click)="openEdit(row)" aria-label="Edit">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="remove(row)" aria-label="Delete">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>

      <div class="emptyState" *ngIf="items.length === 0">
        <mat-icon class="emptyIcon">fitness_center</mat-icon>
        <h3>No workouts</h3>
        <p>Click <b>Add workout</b> to start tracking.</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: calc(100vh - 150px);
      border-radius: 20px;
      padding: 24px;
      margin: -18px;
    }
    .pageHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .headerContent {
      display: flex;
      align-items: center;
      gap: 16px;
      color: white;
    }
    .headerIcon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.9;
    }
    h2 {
      margin: 0;
      color: white;
      font-size: 32px;
      font-weight: 800;
    }
    .subtitle {
      margin: 4px 0 0;
      color: rgba(255,255,255,0.85);
      font-size: 14px;
    }
    .addBtn {
      background: white !important;
      color: #667eea !important;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .loader {
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .tableCard {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
    table {
      width: 100%;
      background: white;
    }
    .actions {
      display: flex;
      gap: 6px;
    }
    .emptyState {
      text-align: center;
      padding: 60px 20px;
      color: rgba(0,0,0,0.6);
    }
    .emptyIcon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      margin: 0 auto 16px;
      opacity: 0.3;
    }
    .emptyState h3 {
      margin: 0 0 8px;
      font-size: 20px;
      color: rgba(0,0,0,0.7);
    }
    .emptyState p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class WorkoutsPage implements OnInit {
  items: Workout[] = [];
  exerciseTypes: ExerciseType[] = [];
  loading = false;

  cols = ['date', 'exercise', 'duration', 'calories', 'intensity', 'fatigue', 'actions'];

  constructor(
    private workoutsApi: WorkoutsService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll() {
    this.loading = true;
    forkJoin({
      exerciseTypes: this.workoutsApi.getExerciseTypes(),
      workouts: this.workoutsApi.my()
    }).subscribe({
      next: (res) => {
        this.exerciseTypes = res.exerciseTypes;
        this.items = res.workouts;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.exerciseTypes = [];
        this.items = [];
        this.loading = false;
        this.cdr.markForCheck();
        this.snack.open(err?.error?.message ?? 'Failed to load workouts', 'OK', { duration: 3000 });
      }
    });
  }

  getExerciseTypeName(value: number): string {
    return this.exerciseTypes.find(et => et.value === value)?.name ?? 'Unknown';
  }

  openCreate() {
    if (!this.exerciseTypes || this.exerciseTypes.length === 0) {
      this.snack.open('Loading exercise types, please try again shortly...', 'OK', { duration: 3000 });
      return;
    }

    const ref = this.dialog.open(WorkoutDialogComponent, {
      width: '520px',
      data: { mode: 'create', exerciseTypes: this.exerciseTypes }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      this.workoutsApi.create(result).subscribe({
        next: () => {
          this.snack.open('Workout added', 'OK', { duration: 2000 });
          this.refreshAll();
        },
        error: (err: any) => this.snack.open(err?.error?.message ?? 'Failed to add workout', 'OK', { duration: 3000 })
      });
    });
  }

  openEdit(row: Workout) {
    const ref = this.dialog.open(WorkoutDialogComponent, {
      width: '520px',
      data: { mode: 'edit', exerciseTypes: this.exerciseTypes, workout: row }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;

      this.workoutsApi.update(row.id, result).subscribe({
        next: () => {
          this.snack.open('Workout updated', 'OK', { duration: 2000 });
          this.refreshAll();
        },
        error: (err: any) => this.snack.open(err?.error?.message ?? 'Failed to update workout', 'OK', { duration: 3000 })
      });
    });
  }

  remove(row: Workout) {
    const exerciseName = this.getExerciseTypeName(row.exerciseType);
    const ok = confirm(`Delete workout: "${exerciseName}" (${new Date(row.workoutDateTime).toLocaleString()}) ?`);
    if (!ok) return;

    this.workoutsApi.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Workout deleted', 'OK', { duration: 2000 });
        this.refreshAll();
      },
      error: (err: any) => this.snack.open(err?.error?.message ?? 'Failed to delete workout', 'OK', { duration: 3000 })
    });
  }
}
