import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsActions } from '../../admins/+state/admins.action';
import { select, Store } from '@ngrx/store';
import { DialogRef } from '@angular/cdk/dialog';
import { AdminStatusEnum } from '../../admins/+state/enums/admin-status.enum';
import { Subject, Subscription } from 'rxjs';
import { selectAdminDetails } from '../../admins/+state/admins.selector';
import { MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ADMIN_DETAILS_KEY } from '../../admins/+state/admins-details.reducer';

@Component({
  selector: 'app-create-admin-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
    MatDialogActions
  ],
  templateUrl: './edit-admin-by-super-admin-dialog-modal.component.html',
  styleUrl: './edit-admin-by-super-admin-dialog-modal.component.scss'
})
export class EditAdminBySuperAdminDialogModal implements OnInit, OnDestroy {
  public adminForm: FormGroup;
  public store = inject(Store);
  private destroy$ = new Subject<void>();
  protected subscription$ = new Subscription();
  private dialogRef = inject(DialogRef<EditAdminBySuperAdminDialogModal>);
  protected adminDetailsSelected$ = this.store.pipe(select(selectAdminDetails));

  constructor(@Inject(MAT_DIALOG_DATA) public data: { gymId: string; id: string },
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.adminForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  public submitForm() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.adminForm.valid) {
        const formData = this.adminForm.value;
        console.log(formData);
        this.store.dispatch(AdminsActions.updateAdmin({
          id: this.data.id,
          admin: {
            username: formData.username,
            email: formData.email,
            gymId:this.data.gymId
          },
          token: localStorage.getItem('accessToken')
        }));
      }
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      console.log(this.data);
      this.store.dispatch(AdminsActions.loadAdminDetails({
        token: localStorage.getItem('accessToken'),
        id: this.data.id
      }))
      this.adminsSubscription();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.subscription$.unsubscribe();
  }

  public adminsSubscription() {
    this.subscription$.add(
      this.adminDetailsSelected$.subscribe({
        next: (adminsListState) => {
          const adminDetailsBo = adminsListState[ADMIN_DETAILS_KEY];
          if (adminsListState?.status === AdminStatusEnum.loadDetailsSuccess) {
            this.adminForm.patchValue({
              email: adminDetailsBo.email,
              username: adminDetailsBo.username,
            })
          }
          if (adminsListState?.status === AdminStatusEnum.updateSuccess) {
            this.dialogRef.close();
          }
        }
      })
    );
  }

  public closeModal() {
    this.dialogRef.close();
  }
}
