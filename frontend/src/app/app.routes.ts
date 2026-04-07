import { Routes } from '@angular/router';
import { LoginPage } from './login-page/login.page';
import { DashboardPage } from './dashboard-page/dashboard.page';
import { PortalAdminLoginPage } from './portal-admin-login/portal-admin-login.page';
import { PortalAdminDashboardPage } from './portal-admin-dashboard/portal-admin-dashboard.page';
import { GymsDashboardPage } from './gyms/gyms-dashboard.page';
import { CreateNewGymPage } from './gyms/add-gym-page/create-new-gym.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'super-admin-login',
    component: PortalAdminLoginPage
  },
  {
    path: 'portal-admin',
    component: PortalAdminDashboardPage,
    children: [
      { path: '', redirectTo: 'gyms', pathMatch: 'full' },
      { path: 'gyms', component: GymsDashboardPage },
      { path: 'add-gym', component: CreateNewGymPage },
      // { path: 'settings', component: SettingsDashboardComponent },
      {
        path: '',
        component: PortalAdminDashboardPage
      },
      // {
      //   path: 'gyms/:id',
      //   component: PortalAdminDashboardPage
      // }
      ]
  },
  {
    path: 'dashboard',
    component: DashboardPage
  }
];
