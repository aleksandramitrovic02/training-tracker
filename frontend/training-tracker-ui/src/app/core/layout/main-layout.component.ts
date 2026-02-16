import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="container">
      <mat-sidenav #sidenav mode="side" opened class="sidenav">
        <div class="brand">
          <div class="logo">TT</div>
          <div class="name">Training Tracker</div>
        </div>

        <mat-divider></mat-divider>

        <mat-nav-list>
          <a mat-list-item routerLink="/workouts" routerLinkActive="active">
            <mat-icon>fitness_center</mat-icon>
            <span>Workouts</span>
          </a>

          <a mat-list-item routerLink="/progress" routerLinkActive="active">
            <mat-icon>insights</mat-icon>
            <span>Progress</span>
          </a>
        </mat-nav-list>

        <div class="spacer"></div>

        <button mat-stroked-button class="logout" (click)="logout()">
          <mat-icon>logout</mat-icon>
          Log out
        </button>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menuBtn">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="title">Training Tracker</span>
          <span class="fill"></span>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .container { 
      height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .sidenav { 
      width: 260px; 
      padding: 16px;
      background: white;
      box-shadow: 2px 0 12px rgba(0,0,0,0.08);
    }
    .brand { 
      display: flex; 
      align-items: center; 
      gap: 12px; 
      padding: 12px 8px 18px;
      margin-bottom: 8px;
    }
    .logo { 
      width: 42px; 
      height: 42px; 
      border-radius: 12px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-weight: 800;
      color: white;
      box-shadow: 0 4px 12px rgba(102,126,234,0.3);
    }
    .name { 
      font-weight: 700;
      font-size: 16px;
      color: rgba(0,0,0,0.85);
    }
    .spacer { flex: 1; }
    .logout { 
      width: 100%; 
      margin-top: 12px;
      border: 2px solid rgba(0,0,0,0.1);
      font-weight: 600;
    }

    mat-nav-list {
      padding-top: 8px;
    }
    mat-nav-list a {
      border-radius: 12px;
      margin-bottom: 4px;
      font-weight: 500;
      transition: all 0.2s;
    }
    mat-nav-list a mat-icon {
      margin-right: 12px;
      opacity: 0.7;
    }
    mat-nav-list a:hover {
      background: rgba(0,0,0,0.04);
    }
    mat-nav-list a.active {
      background: linear-gradient(135deg, rgba(102,126,234,0.15) 0%, rgba(118,75,162,0.15) 100%);
      font-weight: 600;
    }
    mat-nav-list a.active mat-icon {
      opacity: 1;
      color: #667eea;
    }

    .toolbar { 
      position: sticky; 
      top: 0; 
      z-index: 10;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .menuBtn { display: none; }
    .title { 
      font-weight: 700;
      font-size: 18px;
    }
    .fill { flex: 1; }

    .content { 
      padding: 18px;
      max-width: 1600px;
      margin: 0 auto;
    }

    @media (max-width: 900px) {
      .menuBtn { display: inline-flex; }
    }
  `]
})
export class MainLayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout().subscribe({ complete: () => this.router.navigate(['/login']) });
  }
}
