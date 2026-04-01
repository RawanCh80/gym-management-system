import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, take } from 'rxjs';
import { selectMembersList } from '../members/+state/members.selector';
import { MembersActions } from '../members/+state/members.action';
import { Router } from '@angular/router';
import { MembersStatusEnum } from '../members/+state/enums/members-status.enum';
import { MEMBERS_KEY } from '../members/+state/members.reducer';
import { MemberItemBo } from '../members/bo/member-item.bo';
import { MemberForCreationModal } from '../members/create-member-modal/member-for-creation.modal';
import { MatDialog } from '@angular/material/dialog';

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
  protected store = inject(Store);
  protected matDialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  protected gymsListSelected$ = this.store.pipe(select(selectGymsList));
  accessToken: string | null = null;
  searchQuery: string = '';
  filteredMembers: MemberItemBo[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accessToken = localStorage.getItem('accessToken');
      if (!this.accessToken) {
        this.router.navigate(['/login']);
      } else {
        this.store.dispatch(MembersActions.loadMembers({ token: this.accessToken }));
        this.MembersSubscription();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  public MembersSubscription() {
    this.subscription$.add(
      this.membersListSelected$.subscribe({
        next: (membersListState) => {
          if (membersListState?.status === MembersStatusEnum.loadSuccess) {
            this.filteredMembers = membersListState[MEMBERS_KEY];
            setTimeout(() => {
              this.cdr.detectChanges();
            }, 0);
          }
        }
      })
    );
  }

  onSearchMembers() {
    this.membersListSelected$.pipe(take(1)).subscribe((state) => {
      if (state?.status === MembersStatusEnum.loadSuccess) {
        this.filteredMembers = state[MEMBERS_KEY].filter((member) =>
          member.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    });
  }

  onLogout() {
    localStorage.removeItem('accessToken');
    this.subscription$.unsubscribe();
    this.router.navigate(['/login']);
  }


  onAddMember() {
    this.matDialog.open(MemberForCreationModal, {
      width: '99%',
      height: '99%',
      data: {
        token: this.accessToken
      }
    });
  }

  protected readonly MembersStatusEnum = MembersStatusEnum;
  protected readonly MEMBERS_KEY = MEMBERS_KEY;
}
