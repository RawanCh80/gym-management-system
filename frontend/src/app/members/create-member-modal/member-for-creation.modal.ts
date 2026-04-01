import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: { token: string }) {
    this.productTemplateForCreationFormGroup = new FormGroup({
      fullName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      membershipStart: new FormControl(null, Validators.required),
      isActive: new FormControl(true),
      membershipName: new FormControl(''),
      notes: new FormControl(''),
      durationDays: new FormControl(0),
      numberOfSessions: new FormControl(0),
      price: new FormControl(0)
      // ,
      // sessions: new FormArray([
      //   new FormGroup({
      //     sessionNb: new FormControl('', Validators.required),
      //     date: new FormControl('', Validators.required),
      //     note: new FormControl('', Validators.required),
      //   })
      // ])
    });
  }

  get productsFormArray(): FormArray {
    return this.productTemplateForCreationFormGroup.get('sessions') as FormArray;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.memberTemplateStateSubscription();
  }

  public addSession() {
    this.productsFormArray.push(new FormGroup({
      // sessionNb: new FormControl('', Validators.required),
      //     date: new FormControl('', Validators.required),
      //     note: new FormControl('', Validators.required),
    }));
  }

  public createMember() {
    this.store.dispatch(MembersActions.createMember({
        member: this.productTemplateForCreationFormGroup.value,
        token: this.data.token
      })
    );
  }

  public deleteProduct(index: number) {
    this.productsFormArray.removeAt(index);
  }

  public dismissModal() {
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
