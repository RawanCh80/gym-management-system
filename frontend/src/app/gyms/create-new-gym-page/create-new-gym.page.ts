import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { selectGymDetails } from '../+state/gyms.selector';
import { GymStatusEnum } from '../+state/enums/gym-status.enum';
import { GymsActions } from '../+state/gyms.action';
import { Router } from '@angular/router';
import { DashboardUiService } from '../../portal-admin/services/dashboard-ui.service';

@Component({
  selector: 'app-create-new-gym-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-new-gym.page.html',
  styleUrl: './create-new-gym.page.scss'
})
export class CreateNewGymPage implements OnInit, OnDestroy {
  protected store = inject(Store);
  private router = inject(Router);
  public gymForCreationFormGroup: FormGroup;
  private dashboardUiService = inject(DashboardUiService);
  private destroy$ = new Subject<void>();
  public gymStateLoaded$ = this.store.select(selectGymDetails);
  private subscription = new Subscription();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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
    if (isPlatformBrowser(this.platformId)) {
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
}
