import { Routes } from '@angular/router';
import { LoginPage } from './admins/login/login.page';
import { DashboardPage } from './admins/dashboard-page/dashboard.page';
import { PortalAdminLoginPage } from './portal-admin/login/portal-admin-login.page';
import { GymsDashboardPage } from './gyms/gyms-dashboard.page';
import { CreateNewGymPage } from './gyms/create-new-gym-page/create-new-gym.page';
import { GymDetailsPage } from './gyms/gym-details-page/gym-details.page';
import { PortalAdminDashboardPage } from './portal-admin/portal-admin-dashboard.page';
import { MembersDashboardPage } from './members/members-dashboard.page';

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
      {
        path: 'gyms/:id',
        component: GymDetailsPage
      }
    ]
  },
  {
    path: 'dashboard',
    component: DashboardPage,
    children: [
      { path: '', redirectTo: 'members', pathMatch: 'full' },
      { path: 'members', component: MembersDashboardPage }
    ]
  }
];
