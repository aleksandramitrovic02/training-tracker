import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Services & Models
import { ProgressService } from '../../core/services/progress.service';
import { MonthlyProgressResponse } from '../progress.models';

@Component({
  standalone: true,
  selector: 'app-progress-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  template: `
    <div class="pageHeader">
      <div class="headerContent">
        <mat-icon class="headerIcon">insights</mat-icon>
        <div>
          <h2>Napredak</h2>
          <p class="subtitle">Prati svoj napredak kroz vreme</p>
        </div>
      </div>

      <div class="controls">
        <button mat-icon-button class="navBtn" (click)="prevMonth()">
          <mat-icon>chevron_left</mat-icon>
        </button>

        <div class="monthLabel">
          {{ monthName(selectedMonth) }} {{ selectedYear }}
        </div>

        <button mat-icon-button class="navBtn" (click)="nextMonth()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </div>
    </div>

    <mat-progress-bar *ngIf="loading" mode="indeterminate" class="loader"></mat-progress-bar>

    <div class="grid" *ngIf="!loading && data">
      <mat-card class="summary">
        <h3 class="summaryTitle">Mesečna statistika</h3>
        <div class="sumGrid">
          <div class="sumItem item1">
            <mat-icon class="sumIcon">fitness_center</mat-icon>
            <div class="k">Ukupno treninga</div>
            <div class="v">{{ totalWorkouts }}</div>
          </div>
          <div class="sumItem item2">
            <mat-icon class="sumIcon">schedule</mat-icon>
            <div class="k">Ukupno minuta</div>
            <div class="v">{{ totalMinutes }}</div>
          </div>
          <div class="sumItem item3">
            <mat-icon class="sumIcon">bolt</mat-icon>
            <div class="k">Prosečan intenzitet</div>
            <div class="v">{{ avgIntensityAll }}</div>
          </div>
          <div class="sumItem item4">
            <mat-icon class="sumIcon">battery_alert</mat-icon>
            <div class="k">Prosečan umor</div>
            <div class="v">{{ avgFatigueAll }}</div>
          </div>
        </div>
      </mat-card>

      <mat-card class="week" *ngFor="let w of data.weeks; let i = index" [class.week-alt]="i % 2 === 0">
        <div class="weekTitle">
          <mat-icon>calendar_today</mat-icon>
          {{ w.weekStart | date:'dd.MM' }} - {{ w.weekEnd | date:'dd.MM' }}
        </div>

        <div class="statsGrid">
          <div class="stat">
            <mat-icon class="statIcon">fitness_center</mat-icon>
            <div>
              <div class="statLabel">Treninzi</div>
              <div class="statValue">{{ w.workoutCount }}</div>
            </div>
          </div>

          <div class="stat">
            <mat-icon class="statIcon">schedule</mat-icon>
            <div>
              <div class="statLabel">Minuti</div>
              <div class="statValue">{{ w.totalDurationMinutes }}</div>
            </div>
          </div>

          <div class="stat">
            <mat-icon class="statIcon">bolt</mat-icon>
            <div>
              <div class="statLabel">Intenzitet</div>
              <div class="statValue">{{ fmt(w.avgIntensity) }}</div>
            </div>
          </div>

          <div class="stat">
            <mat-icon class="statIcon">battery_alert</mat-icon>
            <div>
              <div class="statLabel">Umor</div>
              <div class="statValue">{{ fmt(w.avgFatigue) }}</div>
            </div>
          </div>
        </div>
      </mat-card>

      <div class="emptyState" *ngIf="data.weeks.length === 0">
        <mat-icon class="emptyIcon">calendar_today</mat-icon>
        <h3>Nema podataka</h3>
        <p>Nema treninga za ovaj mesec.</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    .controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      padding: 4px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
    }
    .navBtn {
      color: white;
    }
    .monthLabel {
      font-weight: 700;
      padding: 0 12px;
      color: white;
      min-width: 140px;
      text-align: center;
    }
    .loader {
      border-radius: 4px;
      margin-bottom: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }
    .summary {
      grid-column: 1 / -1;
      border-radius: 16px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    }
    .summaryTitle {
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: 700;
      color: rgba(0,0,0,0.8);
    }
    .sumGrid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0,1fr));
      gap: 16px;
    }
    .sumItem {
      padding: 20px;
      border-radius: 12px;
      background: linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%);
      position: relative;
      overflow: hidden;
    }
    .sumItem.item1 { background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); }
    .sumItem.item2 { background: linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%); }
    .sumItem.item3 { background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%); }
    .sumItem.item4 { background: linear-gradient(135deg, #fa709a15 0%, #fee14015 100%); }
    .sumIcon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      margin-bottom: 8px;
      opacity: 0.6;
    }
    .k {
      font-size: 12px;
      opacity: 0.7;
      margin-bottom: 4px;
      font-weight: 500;
    }
    .v {
      font-size: 32px;
      font-weight: 800;
      line-height: 1;
    }
    .week {
      border-radius: 16px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .week:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
    }
    .week-alt {
      background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,1) 100%);
    }
    .weekTitle {
      font-weight: 700;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(0,0,0,0.8);
      padding-bottom: 12px;
      border-bottom: 2px solid rgba(0,0,0,0.06);
    }
    .weekTitle mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .statsGrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: rgba(0,0,0,0.02);
      border-radius: 8px;
    }
    .statIcon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      opacity: 0.5;
    }
    .statLabel {
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .statValue {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.2;
    }
    .emptyState {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
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

    @media (max-width: 1100px) {
      .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sumGrid { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }
    @media (max-width: 700px) {
      .grid { grid-template-columns: 1fr; }
      .sumGrid { grid-template-columns: 1fr; }
      .statsGrid { grid-template-columns: 1fr; }
    }
  `]
})
export class ProgressPage implements OnInit {
  loading = false;
  data: MonthlyProgressResponse | null = null;

  selectedYear: number;
  selectedMonth: number; // 1-12

  constructor(private api: ProgressService, private snack: MatSnackBar) {
    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.api.monthly(this.selectedYear, this.selectedMonth).subscribe({
      next: (res: MonthlyProgressResponse) => {
        this.data = res;
      },
      error: (err: any) => {
        this.snack.open(err?.error?.message ?? 'Greška pri učitavanju napretka', 'OK', { duration: 3000 });
      }
    });
  }

  prevMonth() {
    this.selectedMonth--;
    if (this.selectedMonth === 0) { this.selectedMonth = 12; this.selectedYear--; }
    this.load();
  }

  nextMonth() {
    this.selectedMonth++;
    if (this.selectedMonth === 13) { this.selectedMonth = 1; this.selectedYear++; }
    this.load();
  }

  monthName(m: number) {
    const names = ['Januar','Februar','Mart','April','Maj','Jun','Jul','Avgust','Septembar','Oktobar','Novembar','Decembar'];
    return names[m - 1] ?? '';
  }

  fmt(n: number) {
    if (n === null || n === undefined) return '0.0';
    return Number(n).toFixed(1);
  }

  get totalWorkouts() {
    return (this.data?.weeks ?? []).reduce((s, w) => s + (w.workoutCount ?? 0), 0);
  }

  get totalMinutes() {
    return (this.data?.weeks ?? []).reduce((s, w) => s + (w.totalDurationMinutes ?? 0), 0);
  }

  get avgIntensityAll() {
    const weeks = (this.data?.weeks ?? []).filter(w => (w.workoutCount ?? 0) > 0);
    if (weeks.length === 0) return '0.0';
    const sum = weeks.reduce((s, w) => s + (w.avgIntensity ?? 0), 0);
    return (sum / weeks.length).toFixed(1);
  }

  get avgFatigueAll() {
    const weeks = (this.data?.weeks ?? []).filter(w => (w.workoutCount ?? 0) > 0);
    if (weeks.length === 0) return '0.0';
    const sum = weeks.reduce((s, w) => s + (w.avgFatigue ?? 0), 0);
    return (sum / weeks.length).toFixed(1);
  }
}
