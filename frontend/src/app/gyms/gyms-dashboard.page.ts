import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { GYMS_KEY } from './+state/gyms.reducer';
import { GymItemBo } from './bo/gym-item.bo';
import { GymStatusEnum } from './+state/enums/gym-status.enum';
import { selectGymsList } from './+state/gyms.selector';
import { GymsActions } from './+state/gyms.action';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PopoverBoxService } from '../libs/components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../libs/components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogService } from '../libs/components/mat-dialog/service/ngx-md-dialog.service';
import { DashboardUiService } from '../portal-admin/services/dashboard-ui.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './gyms-dashboard.page.html',
  styleUrl: './gyms-dashboard.page.scss'
})
export class GymsDashboardPage implements OnInit, OnDestroy {
  // private dialog = inject(MatDialog);
  protected store = inject(Store);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  protected popoverBoxService = inject(PopoverBoxService);
  private dashboardUiService = inject(DashboardUiService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  protected gymsListSelected$ = this.store.pipe(select(selectGymsList));
  accessToken: string | null = null;
  searchQuery: string = '';
  filteredGyms: GymItemBo[] = [];


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/super-admin-login']);
        return;
      }
      this.store.select(selectGymsList).subscribe((state) => {
      });

      this.GymsSubscription();
      this.loadGyms();
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

            this.cdr.detectChanges();
          }
        }
      })
    );
  }

  private loadGyms() {
    if (this.accessToken) {
      this.store.dispatch(GymsActions.loadGyms({ token: this.accessToken }));
    }
  }

  public onSearchGyms() {
    this.gymsListSelected$.pipe(take(1)).subscribe((state) => {
      if (state?.status === GymStatusEnum.loadSuccess) {
        this.filteredGyms = state[GYMS_KEY].filter((gym) =>
          gym.gymName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    });
  }

  public viewDetailsGym(gymId: string) {
    void this.router.navigate(['/portal-admin/gyms', gymId]);
  }

  public onAddGym() {
    this.dashboardUiService.clearMenu();
    this.subscription$.unsubscribe();
    void this.router.navigate(['/portal-admin/add-gym',]);
  }

  public deleteGym(gymId: string): void {
    this.store.dispatch(
      GymsActions.deleteGym({
        id: gymId,
        token: this.accessToken!
      })
    );
  }

  public async presentPopoverActions($event: MouseEvent, gymItem: GymItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(gymItem);
        }
      }
    ]);
  }

  public presentDeleteAlert(gym: GymItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Gym?',
      message: gym.gymName + ' Gym will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: 'red',
          handler: () => {
            this.deleteGym(gym.id);
          }
        },
        {
          label: 'cancel',
          color: '#88a5db',
          handler: () => {
          }
        }
      ]
    };
    this.ngxMdDialogService.openMultiActionsDialog(matYesNoDialogData, { width: '400px' });
  }
}

//
// public openDeleteDialog(gymId: string): void {
//   console.log('OPEN DIALOG CLICKED', gymId);
//   const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
//     width: '420px',
//     data: {
//       gymId: gymId,
//       title: 'Delete Gym',
//       message: 'Are you sure you want to delete this gym?'
//     }
//   });
//
//
//   dialogRef.afterClosed().subscribe((result) => {
//     if (result) {
//       this.deleteGym(result);
//     }
//   });
//   this.openedMenuId = null;
// }
