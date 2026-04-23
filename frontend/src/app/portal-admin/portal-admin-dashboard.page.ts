import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DashboardUiService } from './services/dashboard-ui.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    FaIconComponent,
    RouterOutlet
  ],
  templateUrl: './portal-admin-dashboard.page.html',
  styleUrl: './portal-admin-dashboard.page.scss'
})
export class PortalAdminDashboardPage implements OnInit {
  activeMenu: string = '';
  accessToken: string | null = null;
  private router = inject(Router);
  private dashboardUiService = inject(DashboardUiService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/super-admin-login']);
      } else {
        console.log(localStorage.getItem('accessToken'));
      }
      this.dashboardUiService.activeMenu$.subscribe((menu) => {
        this.activeMenu = menu;
      });

      this.dashboardUiService.setActiveMenu('gyms');
    }
  }

  public setActiveMenu(menu: string): void {
    this.dashboardUiService.setActiveMenu(menu);
  }

  public logout() {
    localStorage.removeItem('accessToken');
    this.dashboardUiService.clearMenu();
    void this.router.navigate(['/super-admin-login']);
  }
}
