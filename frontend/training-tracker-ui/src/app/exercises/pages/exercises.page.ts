import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Services & Models
import { ExercisesService } from '../../core/services/exercises.service';
import { Exercise } from '../exercises.models';
import { ExerciseDialogComponent } from '../components/exercise-dialog.component';

@Component({
  standalone: true,
  selector: 'app-exercises-page',
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
        <mat-icon class="headerIcon">list</mat-icon>
        <div>
          <h2>Vežbe</h2>
          <p class="subtitle">Upravljaj svojim vežbama</p>
        </div>
      </div>
      <button mat-raised-button class="addBtn" (click)="openCreate()">
        <mat-icon>add</mat-icon>
        Dodaj vežbu
      </button>
    </div>

    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="loader"></mat-progress-bar>

    <div class="tableCard" *ngIf="!loading">
      <table mat-table [dataSource]="items" *ngIf="items.length > 0">

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Naziv</th>
          <td mat-cell *matCellDef="let row">{{ row.name }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef style="width:160px">Akcije</th>
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
        <mat-icon class="emptyIcon">list</mat-icon>
        <h3>Nema vežbi</h3>
        <p>Dodaj svoju prvu vežbu da bi mogao da kreiraš treninge.</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
      color: #11998e !important;
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
export class ExercisesPage implements OnInit {
  items: Exercise[] = [];
  loading = false;

  cols = ['name', 'actions'];

  constructor(
    private api: ExercisesService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.my().subscribe({
      next: (res: Exercise[]) => {
        this.items = res;
      },
      error: (err: any) => {
        this.snack.open(err?.error?.message ?? 'Greška pri učitavanju vežbi', 'OK', { duration: 3000 });
      }
    });
  }

  openCreate() {
    const ref = this.dialog.open(ExerciseDialogComponent, {
      width: '420px',
      data: { mode: 'create' }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.api.create({ name: result.name }).subscribe({
        next: () => {
          this.snack.open('Vežba dodata', 'OK', { duration: 2000 });
          this.load();
        },
        error: (err: any) => this.snack.open(err?.error?.message ?? 'Greška pri dodavanju', 'OK', { duration: 3000 })
      });
    });
  }

  openEdit(row: Exercise) {
    const ref = this.dialog.open(ExerciseDialogComponent, {
      width: '420px',
      data: { mode: 'edit', name: row.name }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.api.update(row.id, { name: result.name }).subscribe({
        next: () => {
          this.snack.open('Vežba izmenjena', 'OK', { duration: 2000 });
          this.load();
        },
        error: (err: any) => this.snack.open(err?.error?.message ?? 'Greška pri izmeni', 'OK', { duration: 3000 })
      });
    });
  }

  remove(row: Exercise) {
    const ok = confirm(`Obrisati vežbu: "${row.name}" ?`);
    if (!ok) return;

    this.api.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Vežba obrisana', 'OK', { duration: 2000 });
        this.load();
      },
      error: (err: any) => this.snack.open(err?.error?.message ?? 'Greška pri brisanju', 'OK', { duration: 3000 })
    });
  }
}
