import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, take } from 'rxjs';
import { GymsActions } from '../gyms/+state/gyms.action';
import { Router } from '@angular/router';
import { GYMS_KEY } from '../gyms/+state/gyms.reducer';
import { GymItemBo } from '../gyms/bo/gym-item.bo';
import { MatDialog } from '@angular/material/dialog';
import { GymStatusEnum } from '../gyms/+state/enums/gym-status.enum';
import { selectGymsList } from '../gyms/+state/gyms.selector';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './portal-admin-dashboard.page.html',
  styleUrl: './portal-admin-dashboard.page.scss'
})
export class PortalAdminDashboardPage implements OnInit, OnDestroy {
  selectedIndex = -1;

  protected store = inject(Store);
  protected matDialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  protected gymsListSelected$ = this.store.pipe(select(selectGymsList));
  accessToken: string | null = null;
  searchQuery: string = '';
  filteredGyms: GymItemBo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/super-admin-login']);
      } else {
        console.log(localStorage.getItem('accessToken'));
        this.store.dispatch(GymsActions.loadGyms({ token: this.accessToken }));
        this.GymsSubscription();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public GymsSubscription() {
    this.subscription$.add(
      this.gymsListSelected$.subscribe({
        next: (gymsListState) => {
          if (gymsListState?.status === GymStatusEnum.loadSuccess) {
            this.filteredGyms = gymsListState[GYMS_KEY];
            this.selectedIndex = 0;
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 0);
          }
        }
      })
    );
  }

  onSearchGyms() {
    this.gymsListSelected$.pipe(take(1)).subscribe((state) => {
      if (state?.status === GymStatusEnum.loadSuccess) {
        this.filteredGyms = state[GYMS_KEY].filter((gym) =>
          gym.gymName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    });
  }

  public onLogout() {
    localStorage.removeItem('accessToken');
    this.subscription$.unsubscribe();
    this.router.navigate(['/super-admin-login']);
  }

  public navigateToGymDetails(gymId: string) {
    this.router.navigate(['/portal-admin/gyms', gymId]);
  }


  onAddGym() {
    // this.matDialog.open(GymForCreationModal, {
    //   width: '99%',
    //   height: '99%',
    //   data: {
    //     token: this.accessToken
    //   }
    // });
  }

  protected readonly GymsStatusEnum = GymStatusEnum;
  protected readonly GYMS_KEY = GYMS_KEY;
}
