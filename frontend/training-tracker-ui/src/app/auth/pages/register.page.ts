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
  selector: 'app-register-page',
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
          <h1>Create account</h1>
          <p>Start your fitness journey today</p>
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
              Minimum 6 characters.
            </mat-error>
          </mat-form-field>

          <button mat-raised-button color="primary" class="full submit-btn" [disabled]="form.invalid || loading">
            {{ loading ? 'Creating...' : 'Sign up' }}
          </button>
        </form>

        <div class="links">
          <span>Already have an account?</span>
          <a routerLink="/login" class="login-link">Sign in</a>
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
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    .login-link {
      color: #f5576c;
      font-weight: 600;
      text-decoration: none;
    }
    .login-link:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterPage {
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

    this.auth.register({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading = false;
        this.snack.open('Registration successful. Please sign in.', 'OK', { duration: 2500 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.snack.open(err?.error?.message ?? 'Registration failed', 'OK', { duration: 3000 });
      }
    });
  }
}
