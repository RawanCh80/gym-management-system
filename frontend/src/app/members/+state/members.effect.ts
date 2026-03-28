import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { MembersService } from '../service/members.service';
import { MemberBo } from '../bo/member.bo';
import { Injectable } from '@angular/core';
import { MembersActions } from './members.action';

@Injectable()
export class MembersEffect {

  public loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembers),
      switchMap((action) =>  // destructure token directly
        this.membersService.getMembers(action.token).pipe(
          map((membersList: MemberBo[]) =>
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
              map((memberDetails: MemberBo) => {
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
              switchMap((memberDetailsBo: MemberBo) => {
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
              switchMap((member: MemberBo) => {
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

  constructor(private actions$: Actions,
              private membersService: MembersService) {
  }
}
