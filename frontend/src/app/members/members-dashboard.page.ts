import { ChangeDetectorRef, Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PopoverBoxService } from '../libs/components/mat-pop-over-box/src';
import {
  MatMultiActionsInterface
} from '../libs/components/mat-dialog/mat-mutli-actions-dialog/mat-multi-actions.interface';
import { NgxMdDialogService } from '../libs/components/mat-dialog/service/ngx-md-dialog.service';
import { DashboardUiService } from '../portal-admin/services/dashboard-ui.service';
import { selectMembersList } from './+state/members.selector';
import { MembersActions } from './+state/members.action';
import { MemberItemBo } from './bo/member-item.bo';
import { MEMBERS_KEY } from './+state/members.reducer';
import { MembersStatusEnum } from './+state/enums/members-status.enum';
import { MemberForCreationModal } from './create-member-modal/member-for-creation.modal';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FaIconComponent
  ],
  templateUrl: './members-dashboard.page.html',
  styleUrl: './members-dashboard.page.scss'
})
export class MembersDashboardPage implements OnInit, OnDestroy {
  protected matDialog = inject(MatDialog);
  protected store = inject(Store);
  protected subscription$ = new Subscription();
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  protected popoverBoxService = inject(PopoverBoxService);
  private dashboardUiService = inject(DashboardUiService);
  private ngxMdDialogService = inject(NgxMdDialogService);
  protected membersListSelected$ = this.store.pipe(select(selectMembersList));
  accessToken: string | null = null;
  searchQuery: string = '';
  filteredMembers: MemberItemBo[] = [];


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
      this.MembersSubscription();
      this.loadMembers();
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }


  public MembersSubscription() {
    this.subscription$.add(
      this.membersListSelected$.subscribe({
        next: (membersListState) => {
          if (membersListState?.status === MembersStatusEnum.loadSuccess) {
            this.filteredMembers = membersListState[MEMBERS_KEY];
            // this.filteredMembers = [...(membersListState[MEMBERS_KEY] ?? [])];
            this.cdr.detectChanges();
          }
        }
      })
    );
  }

  private loadMembers() {
    if (this.accessToken) {
      this.store.dispatch(MembersActions.loadMembers({ token: this.accessToken }));
    }
  }

  public onSearchMembers() {
    this.membersListSelected$.pipe(take(1)).subscribe((state) => {
      if (state?.status === MembersStatusEnum.loadSuccess) {
        this.filteredMembers = state[MEMBERS_KEY].filter((member) =>
          member.fullName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      // if (state?.status === MembersStatusEnum.deleteSuccess) {
      //   this.loadMembers();
      // }
    });
  }

  public viewDetailsMember(memberId: string) {
    void this.router.navigate(['/portal-admin/members', memberId]);
  }

  public onAddMember() {
    this.matDialog.open(MemberForCreationModal, {
      width: '80%',
      height: '60%',
      data: {
        token: this.accessToken
      }
    }).afterClosed().subscribe(() => {

      setTimeout(() => {
        this.loadMembers();
      });
    });
  }

  public deleteMember(memberId: string): void {
    this.store.dispatch(
      MembersActions.deleteMember({
        id: memberId,
        token: this.accessToken!
      })
    );
  }

  public async presentPopoverActions($event: MouseEvent, memberItem: MemberItemBo) {
    this.popoverBoxService.openPanel($event, [
      {
        faIcon: ['fas', 'trash'],
        visible: true,
        label: 'Delete',
        handler: () => {
          this.presentDeleteAlert(memberItem);
        }
      }
    ]);
  }

  public presentDeleteAlert(member: MemberItemBo) {
    const matYesNoDialogData: MatMultiActionsInterface = {
      faIcon: ['fas', 'trash'],
      title: 'Delete Member?',
      message: member.fullName + ' Member will be permanently deleted!',
      action: [
        {
          label: 'yes delete',
          color: 'red',
          handler: () => {
            this.deleteMember(member.id);
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
// public openDeleteDialog(memberId: string): void {
//   console.log('OPEN DIALOG CLICKED', memberId);
//   const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
//     width: '420px',
//     data: {
//       memberId: memberId,
//       title: 'Delete Member',
//       message: 'Are you sure you want to delete this member?'
//     }
//   });
//
//
//   dialogRef.afterClosed().subscribe((result) => {
//     if (result) {
//       this.deleteMember(result);
//     }
//   });
//   this.openedMenuId = null;
// }
// export class MembersDashboardPage implements OnInit, OnDestroy {
//   protected matDialog = inject(MatDialog);
//   protected store = inject(Store);
//   private router = inject(Router);
//   protected popoverBoxService = inject(PopoverBoxService);
//   private dashboardUiService = inject(DashboardUiService);
//   private ngxMdDialogService = inject(NgxMdDialogService);
//   protected membersListSelected$ = this.store.pipe(select(selectMembersList));
//
//   accessToken: string | null = null;
//   searchQuery = '';
//   filteredMembers: MemberItemBo[] = [];
//
//   private subscription = new Subscription();
//
//   constructor(@Inject(PLATFORM_ID) private platformId: Object) {
//     this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//   }
//
//   ngOnInit(): void {
//     if (isPlatformBrowser(this.platformId)) {
//       this.accessToken = localStorage.getItem('accessToken');
//
//       if (!this.accessToken) {
//         this.router.navigate(['/super-admin-login']);
//         return;
//       }
//
//       this.subscribeToMembers();
//       this.loadMembers();
//     }
//   }
//
//   ngOnDestroy(): void {
//     this.subscription.unsubscribe();
//   }
//
//   private subscribeToMembers() {
//     this.subscription.add(
//       this.membersListSelected$.subscribe(state => {
//         if (state?.status === MembersStatusEnum.loadSuccess) {
//           this.filteredMembers = [...(state[MEMBERS_KEY] ?? [])];
//         }
//       })
//     );
//   }
//
//   private loadMembers() {
//     if (this.accessToken) {
//       this.store.dispatch(
//         MembersActions.loadMembers({ token: this.accessToken })
//       );
//     }
//   }
//
//   public onSearchMembers() {
//     this.membersListSelected$.pipe(take(1)).subscribe(state => {
//       const members = state?.[MEMBERS_KEY] ?? [];
//
//       this.filteredMembers = members.filter(m =>
//         (m.fullName ?? '')
//           .toLowerCase()
//           .includes(this.searchQuery.toLowerCase())
//       );
//     });
//   }
//
//   public onAddMember() {
//     this.matDialog.open(MemberForCreationModal, {
//       width: '80%',
//       height: '60%',
//       data: { token: this.accessToken }
//     })
//   }
//
//   public deleteMember(memberId: string) {
//     this.store.dispatch(
//       MembersActions.deleteMember({
//         id: memberId,
//         token: this.accessToken!
//       })
//     );
//   }
//
//   public async presentPopoverActions($event: MouseEvent, memberItem: MemberItemBo) {
//     this.popoverBoxService.openPanel($event, [
//       {
//         faIcon: ['fas', 'trash'],
//         visible: true,
//         label: 'Delete',
//         handler: () => {
//           this.presentDeleteAlert(memberItem);
//         }
//       }
//     ]);
//   }
//
//   public presentDeleteAlert(member: MemberItemBo) {
//     const data: MatMultiActionsInterface = {
//       faIcon: ['fas', 'trash'],
//       title: 'Delete Member?',
//       message: `${member.fullName} will be permanently deleted!`,
//       action: [
//         {
//           label: 'yes delete',
//           color: 'red',
//           handler: () => {
//             setTimeout(() => {
//               this.deleteMember(member.id);
//             });
//           }
//         },
//         {
//           label: 'cancel',
//           color: '#88a5db',
//           handler: () => {
//           }
//         }
//       ]
//     };
//
//     this.ngxMdDialogService.openMultiActionsDialog(data, { width: '400px' });
//   }
//
//   public viewDetailsMember(memberId: string) {
//     void this.router.navigate(['/portal-admin/members', memberId]);
//   }
// }
