import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { DashboardPage } from './dashboard-page/dashboard.page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'dashboard',
    component: DashboardPage
  }
];
