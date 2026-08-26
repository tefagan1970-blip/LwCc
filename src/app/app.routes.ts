import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'apidata',
    canActivate: [authGuard],
    loadComponent: () => import('./features/data-page/data-page').then((m) => m.DataPage),
  },
  {
    path: 'apidata/:userName/:nodeName',
    canActivate: [authGuard],
    loadComponent: () => import('./features/data-page/data-page').then((m) => m.DataPage),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
