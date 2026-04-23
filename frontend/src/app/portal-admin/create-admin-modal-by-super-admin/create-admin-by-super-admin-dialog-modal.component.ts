import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { AdminsActions } from '../../admins/+state/admins.action';
import { select, Store } from '@ngrx/store';
import { DialogRef } from '@angular/cdk/dialog';
import { AdminStatusEnum } from '../../admins/+state/enums/admin-status.enum';
import { Subject, Subscription } from 'rxjs';
import { selectAdminDetails } from '../../admins/+state/admins.selector';
import { MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-create-admin-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent,
    MatDialogActions
  ],
  templateUrl: './create-admin-by-super-admin-dialog-modal.component.html',
  styleUrl: './create-admin-by-super-admin-dialog-modal.component.scss'
})
export class CreateAdminDialogModal implements OnInit, OnDestroy {
  public adminForm: FormGroup;
  public store = inject(Store);
  private destroy$ = new Subject<void>();
  protected subscription$ = new Subscription();
  private dialogRef = inject(DialogRef<CreateAdminDialogModal>);
  protected adminDetailsSelected$ = this.store.pipe(select(selectAdminDetails));

  constructor(@Inject(MAT_DIALOG_DATA) public gymId: string,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.adminForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordsMatchValidator });
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  public submitForm() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.adminForm.valid) {
        const formData = this.adminForm.value;
        console.log(formData);
        this.store.dispatch(AdminsActions.createAdmin({
          admin: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            gymId: this.gymId
          },
          token: localStorage.getItem('accessToken')
        }));
      }
    }
  }

  ngOnInit(): void {
    this.adminsSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.subscription$.unsubscribe();
  }

  public adminsSubscription() {
    this.subscription$.add(
      this.adminDetailsSelected$.subscribe({
        next: (adminsListState) => {
          if (adminsListState?.status === AdminStatusEnum.createSuccess) {
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
