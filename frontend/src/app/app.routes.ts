import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { DashboardPage } from './dashboard-page/dashboard.page';
import { PortalAdminLoginPage } from './portal-admin-login/portal-admin-login.page';

export const routes: Routes = [
  {
    path: 'super-admin-login',
    component: PortalAdminLoginPage
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'dashboard',
    component: DashboardPage
  }
];
