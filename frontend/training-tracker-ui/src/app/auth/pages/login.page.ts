import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <div class="header">
          <h1>Welcome back</h1>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
            <mat-error *ngIf="form.controls.email.invalid && form.controls.email.touched">
              Enter a valid email.
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" type="password" />
            <mat-error *ngIf="form.controls.password.invalid && form.controls.password.touched">
              Password is required (min 6).
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full submit-btn" [disabled]="form.invalid || loading">
            {{ loading ? 'Loading...' : 'Sign in' }}
          </button>
        </form>

        <div class="links">
          <span>Don't have an account?</span>
          <a routerLink="/register" class="register-link">Create one</a>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .wrap { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .card { 
      width: 100%; 
      max-width: 440px; 
      padding: 48px 32px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }
    .header p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    .full { 
      width: 100%; 
      margin-bottom: 16px;
    }
    .submit-btn {
      height: 48px;
      font-size: 16px;
      font-weight: 500;
      margin-top: 8px;
    }
    .links { 
      margin-top: 24px; 
      display: flex; 
      gap: 8px; 
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #666;
    }
    .register-link {
      color: #667eea;
      font-weight: 600;
      text-decoration: none;
    }
    .register-link:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginPage {
  loading = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/workouts']);
      },
      error: (err) => {
        this.loading = false;
        this.snack.open(err?.error?.message ?? 'Login failed', 'OK', { duration: 3000 });
      }
    });
  }
}
