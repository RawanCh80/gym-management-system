import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UUID } from 'angular2-uuid';
import { Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { selectMemberDetails } from '../+state/members.selector';
import { MembersStatusEnum } from '../+state/enums/members-status.enum';
import { MembersActions } from '../+state/members.action';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxUiLoaderModule],
  templateUrl: './member-for-creation.modal.html',
  styleUrl: './member-for-creation.modal.scss'
})
//
export class MemberForCreationModal implements OnInit, OnDestroy {
  public uuidLoader = UUID.UUID();
  protected store = inject(Store);
  protected matDialog = inject(MatDialog);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  public productTemplateForCreationFormGroup: FormGroup;
  public memberTemplateState$ = this.store.select(selectMemberDetails);
  protected readonly FormGroup = FormGroup;
  private subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string },
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.productTemplateForCreationFormGroup = new FormGroup({
      fullName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      packages: new FormArray([
        new FormGroup({
          packageName: new FormControl(''),
          durationDays: new FormControl(null, Validators.required),
          numberOfSessions: new FormControl('', Validators.required),
          price: new FormControl(null, Validators.required),
          startDate: new FormControl(null, Validators.required),
          notes: new FormControl(''),
        })
      ])
    });
  }

  get packagesFormArray(): FormArray {
    return this.productTemplateForCreationFormGroup.get('packages') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.memberTemplateStateSubscription();
  }

  public createMember() {
    this.packagesFormArray.at(0).patchValue({
      packageName: 'package 1'
    });
    this.store.dispatch(MembersActions.createMember({
        member: {
          fullName: this.productTemplateForCreationFormGroup.value.fullName,
          phone: this.productTemplateForCreationFormGroup.value.phone,
          packages: this.packagesFormArray.value
        },
        token: this.data.token
      })
    );
  }

  public dismissModal() {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.productTemplateForCreationFormGroup.reset();
    return this.matDialog.closeAll();
  }

  private memberTemplateStateSubscription() {
    this.subscription.add(this.memberTemplateState$.subscribe(memberTemplateState => {
      if (memberTemplateState.status === MembersStatusEnum.createSuccess) {
        this.dismissModal();
      }
    }));
  }
}
