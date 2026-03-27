import { Route } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'files',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/files/files.component').then((m) => m.FilesComponent),
  },
  {
    path: 'files/:id/report',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/report/report.component').then(
        (m) => m.ReportComponent
      ),
  },
  { path: '', redirectTo: 'files', pathMatch: 'full' },
  { path: '**', redirectTo: 'files' },
];
