import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'workouts' },

  { path: 'login', loadComponent: () => import('./auth/pages/login.page').then(m => m.LoginPage) },
  { path: 'register', loadComponent: () => import('./auth/pages/register.page').then(m => m.RegisterPage) },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'workouts', loadComponent: () => import('./workouts/pages/workouts.page').then(m => m.WorkoutsPage) },
      { path: 'progress', loadComponent: () => import('./progress/pages/progress.page').then(m => m.ProgressPage) },
    ]
  },

  { path: '**', redirectTo: 'workouts' }
];
