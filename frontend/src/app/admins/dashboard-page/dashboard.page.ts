import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DashboardUiService } from '../../portal-admin/services/dashboard-ui.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.scss'
})
export class DashboardPage implements OnInit, OnDestroy {
  protected store = inject(Store);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private dashboardUiService = inject(DashboardUiService);
  accessToken: string | null = null;
  activeMenu: string = '';
  isSidebarOpen = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/login']);
      } else {
        console.log(localStorage.getItem('accessToken'));
      }
      this.dashboardUiService.activeMenu$.subscribe((menu) => {
        this.activeMenu = menu;
      });
      this.dashboardUiService.setActiveMenu('members');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public setActiveMenu(menu: string): void {
    this.dashboardUiService.setActiveMenu(menu);
  }

  public logout() {
    localStorage.removeItem('accessToken');
    this.dashboardUiService.clearMenu();
    this.subscription$.unsubscribe();
    this.router.navigate(['/login']);
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
  // onAddMember() {
  //   this.matDialog.open(MemberForCreationModal, {
  //     width: '99%',
  //     height: '99%',
  //     data: {
  //       token: this.accessToken
  //     }
  //   });
  // }
}
