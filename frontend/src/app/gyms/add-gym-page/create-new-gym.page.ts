import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { selectGymDetails } from '../+state/gyms.selector';
import { GymStatusEnum } from '../+state/enums/gym-status.enum';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { GymsActions } from '../+state/gyms.action';
import { Router } from '@angular/router';
import { DashboardUiService } from '../../portal-admin-dashboard/dashboard-ui.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  templateUrl: './create-new-gym.page.html',
  styleUrl: './create-new-gym.page.scss'
})
export class CreateNewGymPage implements OnInit, OnDestroy {
  protected store = inject(Store);
  private router = inject(Router);
  public gymForCreationFormGroup: FormGroup;
  private cdr = inject(ChangeDetectorRef);
  private dashboardUiService = inject(DashboardUiService);
  private destroy$ = new Subject<void>();
  public gymStateLoaded$ = this.store.select(selectGymDetails);
  private subscription = new Subscription();

  constructor() {
    this.gymForCreationFormGroup = new FormGroup({
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
    this.dashboardUiService.clearMenu();
    this.gymTemplateStateSubscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.complete();
  }

  private gymTemplateStateSubscription() {
    this.subscription.add(
      this.gymStateLoaded$.subscribe((gymDetailsState) => {
        if (gymDetailsState?.status === GymStatusEnum.createSuccess) {
          this.ngOnDestroy();
          this.store.dispatch(GymsActions.resetGymDetailsStatus());
          void this.router.navigate(['portal-admin/gyms'], { replaceUrl: true });
          this.dashboardUiService.setActiveMenu('gyms');
        }
      })
    );
  }


  public createGym() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return;
    }
    this.store.dispatch(GymsActions.createGym({
      gym: this.gymForCreationFormGroup.value,
      token: token
    }))
  }
}
