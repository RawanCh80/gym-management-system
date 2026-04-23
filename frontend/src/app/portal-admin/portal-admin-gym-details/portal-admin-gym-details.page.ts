import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { AdminsActions } from '../../admins/+state/admins.action';
import { ActivatedRoute, Router } from '@angular/router';
import { ADMINS_KEY } from '../../admins/+state/admins.reducer';
import { AdminItemBo } from '../../admins/bo/admin-item.bo';
import { MatDialog } from '@angular/material/dialog';
import { AdminStatusEnum } from '../../admins/+state/enums/admin-status.enum';
import { selectAdminsList } from '../../admins/+state/admins.selector';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './portal-admin-gym-details.page.html',
  styleUrl: './portal-admin-gym-details.page.scss'
})
export class PortalAdminDetailsPage implements OnInit, OnDestroy {
  selectedIndex = -1;

  protected store = inject(Store);
  protected matDialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected adminsListSelected$ = this.store.pipe(select(selectAdminsList));
  accessToken: string | null = null;
  searchQuery: string = '';
  filteredAdmins: AdminItemBo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  public gymId!: string;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/super-admin-login']);
      } else {
        console.log(localStorage.getItem('accessToken'));
        this.store.dispatch(AdminsActions.loadAdmins({ token: this.accessToken, gymId: this.gymId }));
        this.adminsSubscription();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public adminsSubscription() {
    this.subscription$.add(
      this.adminsListSelected$.subscribe({
        next: (adminsListState) => {
          if (adminsListState?.status === AdminStatusEnum.loadSuccess) {
            this.filteredAdmins = adminsListState[ADMINS_KEY];
            this.selectedIndex = 0;
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 0);
          }
        }
      })
    );
  }


  onLogout() {
    localStorage.removeItem('accessToken');
    this.subscription$.unsubscribe();
    this.router.navigate(['/super-admin-login']);
  }

  // navigateToAdminDetails(gymId: string) {
  //   this.router.navigate(['/portal-admin/admins', gymId]);
  // }


  onAddAdmin() {
    // this.matDialog.open(AdminForCreationModal, {
    //   width: '99%',
    //   height: '99%',
    //   data: {
    //     token: this.accessToken
    //   }
    // });
  }

  protected readonly AdminsStatusEnum = AdminStatusEnum;
  protected readonly ADMINS_KEY = ADMINS_KEY;
}
