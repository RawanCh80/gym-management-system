import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatError } from '@angular/material/form-field';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { AdminsActions } from '../admins/+state/admins.action';
import { isPlatformBrowser } from '@angular/common';
import { passwordComplexityValidator, passwordsAreNotSameValidator } from './helper/form-validator.helper';

@Component({
  templateUrl: './update-password.modal.html',
  styleUrls: ['./update-password.modal.scss'],
  imports: [
    ReactiveFormsModule,
    MatError,
    MatDialogActions,
    FaIconComponent
  ],
  standalone: true
})
export class UpdatePasswordModal {
  store = inject(Store);
  matDialogRef = inject(MatDialogRef<UpdatePasswordModal>);
  public resetPasswordForm = new FormGroup({
      newPasswordControl: new FormControl('', [passwordComplexityValidator]),
      confirmPasswordControl: new FormControl('')
    },
    {
      validators: [
        passwordsAreNotSameValidator('newPasswordControl', 'confirmPasswordControl')
      ]
    });

  constructor(@Inject(MAT_DIALOG_DATA) public id: string,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  public closeModal() {
    this.matDialogRef.close();
  }

  public saveNewPassword() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    if (isPlatformBrowser(this.platformId)) {
      try {
        const token = localStorage.getItem('accessToken');

        // if (!token) {
        //   this.toastrService.error('No access token found');
        //   return;
        // }

        this.store.dispatch(
          AdminsActions.updateAdminPasswordBySuperAdmin({
            token,
            newPassword:
              this.resetPasswordForm.value.newPasswordControl!,
            id: this.id
          })
        );

        // this.toastrService.success(
        //   'Password Updated Successfully'
        // );

        this.matDialogRef.close();
      } catch (err) {
        // this.toastrService.error(
        //   'Cannot Update Password'
        // );
      }
    }
  }
}
