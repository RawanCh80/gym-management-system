import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { MembersService } from '../service/members.service';
import { MemberDetailsBo } from '../bo/member-details.bo';
import { inject, Injectable } from '@angular/core';
import { MembersActions } from './members.action';
import { MemberItemBo } from '../bo/member-item.bo';

@Injectable()
export class  MembersEffect {
  private actions$ = inject(Actions);
  private membersService = inject(MembersService);
  public loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembers),
      switchMap((action) =>
        this.membersService.getMembers(action.token).pipe(
          map((membersList: MemberItemBo[]) =>
            MembersActions.loadMembersSuccess({ members: membersList })
          ),
          catchError((error) =>
            of(MembersActions.loadMembersFailure({ error }))
          )
        )
      )
    )
  );

  public $loadMemberDetails = createEffect(() =>
    this.actions$
      .pipe(
        ofType(MembersActions.loadMemberDetails),
        switchMap((action) => {
          return this.membersService
            .getMemberDetails(action.id, action.token)
            .pipe(
              map((memberDetails: MemberDetailsBo) => {
                return MembersActions.loadMemberDetailsSuccess({ member: memberDetails });
              }),
              catchError((error) => {
                return of(MembersActions.loadMemberDetailsFailure({ error: error }));
              })
            );
        })
      ));

  public $deleteMember = createEffect(() =>
    this.actions$
      .pipe(
        ofType(MembersActions.deleteMember),
        switchMap((action) => {
          return this.membersService
            .deleteMember(action.id, action.token)
            .pipe(
              switchMap(() => {
                return [
                  MembersActions.deleteMemberSuccess(),
                  MembersActions.resetMemberDetailsStatus(),
                  MembersActions.loadMembers({ token: action.token })
                ];
              }),
              catchError((error) => {
                return of(MembersActions.deleteMemberFailure({ error }));
              })
            );
        })
      )
  );


  public $updateMember = createEffect(() =>
    this.actions$
      .pipe(
        ofType(MembersActions.updateMember),
        switchMap((action) => {
          return this.membersService
            .updateMember(action.id, action.member, action.token)
            .pipe(
              switchMap((memberDetailsBo: MemberDetailsBo) => {
                return [
                  MembersActions.updateMemberSuccess(),
                  MembersActions.resetMemberDetailsStatus(),
                  MembersActions.loadMembers({ token: action.token })
                ];
              }),
              catchError((error) => {
                return of(MembersActions.updateMemberFailure({ error }));
              })
            );
        })
      )
  );

  public $createMember = createEffect(() =>
    this.actions$
      .pipe(
        ofType(MembersActions.createMember),
        switchMap((action) => {
          return this.membersService
            .createMember(action.member, action.token)
            .pipe(
              switchMap((member: MemberDetailsBo) => {
                return [
                  MembersActions.createMemberSuccess(),
                  MembersActions.resetMemberDetailsStatus(),
                  MembersActions.loadMembers({ token: action.token }),
                ];
              }),
              catchError((error) => {
                return of(MembersActions.createMemberFailure({ error }));
              })
            );
        })
      )
  );
}
