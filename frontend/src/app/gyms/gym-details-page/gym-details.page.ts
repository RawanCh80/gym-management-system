import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { selectGymDetails } from '../+state/gyms.selector';
import { GymStatusEnum } from '../+state/enums/gym-status.enum';
import { GymsActions } from '../+state/gyms.action';
import { ActivatedRoute, Router } from '@angular/router';
import { GYM_DETAILS_KEY } from '../+state/gyms-details.reducer';
import { AdminsActions } from '../../admins/+state/admins.action';
import { LetDirective } from '@ngrx/component';
import { ADMINS_KEY } from '../../admins/+state/admins.reducer';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateAdminDialogModal
} from '../../portal-admin/create-admin-modal-by-super-admin/create-admin-by-super-admin-dialog-modal.component';
import { selectAdminsList } from '../../admins/+state/admins.selector';
import { PopoverBoxService } from '../../libs/components/mat-pop-over-box/src';
import { NgxMdDialogService } from '../../libs/components/mat-dialog/service/ngx-md-dialog.service';
import {
  MatMultiActionsInterface
} from '../../libs/components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { AdminItemBo } from '../../admins/bo/admin-item.bo';
import { UpdatePasswordModal } from '../../update-password/update-password.modal';
import { DashboardUiService } from '../../portal-admin/services/dashboard-ui.service';
import {
  EditAdminBySuperAdminDialogModal
} from '../../portal-admin/edit-admin-modal-by-super-admin/edit-admin-by-super-admin-dialog-modal.component';

@Component({
  selector: 'app-gym-details-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LetDirective,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    FaIconComponent,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow
  ],
  templateUrl: './gym-details.page.html',
  styleUrl: './gym-details.page.scss'
})
export class GymDetailsPage implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['userName', 'actions'];
  protected store = inject(Store);
  private dialog = inject(MatDialog);
  public gymDetailsFormGroup: FormGroup;
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private matDialog = inject(MatDialog);
  private dashboardUiService = inject(DashboardUiService);
  protected popoverBoxService = inject(PopoverBoxService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  public gymStateLoaded$ = this.store.select(selectGymDetails);
  public adminStateSelected$ = this.store.select(selectAdminsList);
  private subscription = new Subscription();
  private destroy$ = new Subject<void>();
  public gymId!: string;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.gymDetailsFormGroup = new FormGroup({
      gymName: new FormControl('', Validators.required),
      ownerName: new FormControl(''),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+?\d{7,15}$/)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      address: new FormControl('', Validators.required),
      subscriptionPlan: new FormControl(''),
      isActive: new FormControl(true)
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      this.gymId = this.activatedRoute.snapshot.paramMap.get('id');
      if (!token) {
        return;
      }
      this.dashboardUiService.clearMenu();
      this.store.dispatch(GymsActions.loadGymDetails({
        token: token,
        id: this.gymId
      }))
      this.gymTemplateStateSubscription();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.complete();
  }

  private gymTemplateStateSubscription() {
    this.subscription.add(
      this.gymStateLoaded$.subscribe((gymDetailsState) => {
        const gymDetailsBo = gymDetailsState[GYM_DETAILS_KEY];
        if (gymDetailsState?.status === GymStatusEnum.loadDetailsSuccess) {
          this.gymDetailsFormGroup.patchValue({
              gymName: gymDetailsBo?.gymName,
              ownerName: gymDetailsBo?.ownerName,
              phone: gymDetailsBo?.phone,
              email: gymDetailsBo?.email,
              address: gymDetailsBo?.address,
              subscriptionPlan: gymDetailsBo?.subscriptionPlan,
              isActive: gymDetailsBo?.isActive,
            }
          );
          if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('accessToken');
            this.store.dispatch(AdminsActions.loadAdmins({
              token: token,
              gymId: this.gymId
            }))
          }
        }
        if (gymDetailsState.status === GymStatusEnum.updateSuccess) {
          void this.router.navigate(['portal-admin/gyms'], { replaceUrl: true });
        }
      })
    );
  }

  public onBack() {
    void this.router.navigate(['portal-admin/gyms'], { replaceUrl: true });
  }

  public updateGym() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return;
      }
      this.store.dispatch(GymsActions.updateGym({
        id: this.gymId,
        gym: this.gymDetailsFormGroup.value,
        token: token
      }))
    }
  }

  protected onAddAdmin() {
    this.dialog.open(CreateAdminDialogModal, {
      width: '420px',
      data: this.gymId
    });
  }

  public async presentPopoverActions($event: MouseEvent, adminId: string) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'edit'],
        visible: true,
        label: 'Edit',
        handler: () => {
          this.onEditAdmin(adminId);
        }
      },
      {
        faIcon: ['fas', 'lock'],
        visible: true,
        label: 'Change password',
        handler: () => {
          this.presentUpdatePasswordModal(adminId);
        }
      }
    ]);
  }

  public presentDeleteAlert(admin: AdminItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Admin?',
      message: admin.username + ' Admin will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: 'red',
          handler: () => {
            this.deleteAdmin(admin.id);
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

  public deleteAdmin(adminId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(
        AdminsActions.deleteAdmin({
          id: adminId,
          token: localStorage.getItem('accessToken'),
          gymId: this.gymId
        })
      );
    }
  }

  public async presentUpdatePasswordModal(id: string) {
    this.matDialog.open(UpdatePasswordModal, {
      width: '400px',
      disableClose: true,
      data: id
    });
  }

  onEditAdmin(id: string) {
    this.dialog.open(EditAdminBySuperAdminDialogModal, {
        width: '420px',
        data: {
          gymId: this.gymId,
          id: id
        }
      }
    );
  }

  protected readonly ADMINS_KEY = ADMINS_KEY;
}
