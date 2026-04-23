import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AdminsService } from '../service/admins.service';
import { inject, Injectable } from '@angular/core';
import { AdminsActions } from './admins.action';
import { AdminItemBo } from '../bo/admin-item.bo';

@Injectable()
export class AdminsEffect {
  private actions$ = inject(Actions);
  private adminsService = inject(AdminsService);
  public loadAdmins$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminsActions.loadAdmins),
      switchMap((action) =>
        this.adminsService.getAdmins(action.token, action.gymId).pipe(
          map((adminsList: AdminItemBo[]) =>
            AdminsActions.loadAdminsSuccess({ admins: adminsList })
          ),
          catchError((error) =>
            of(AdminsActions.loadAdminsFailure({ error }))
          )
        )
      )
    )
  );

  public $loadAdminDetails = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AdminsActions.loadAdminDetails),
        switchMap((action) => {
          return this.adminsService
            .getAdminDetails(action.id, action.token)
            .pipe(
              map((adminDetails: AdminItemBo) => {
                return AdminsActions.loadAdminDetailsSuccess({ admin: adminDetails });
              }),
              catchError((error) => {
                return of(AdminsActions.loadAdminDetailsFailure({ error: error }));
              })
            );
        })
      ));

  public $deleteAdmin = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AdminsActions.deleteAdmin),
        switchMap((action) => {
          return this.adminsService
            .deleteAdmin(action.id, action.token)
            .pipe(
              switchMap(() => {
                return [
                  AdminsActions.deleteAdminSuccess(),
                  AdminsActions.resetAdminDetailsStatus(),
                  AdminsActions.loadAdmins({ token: action.token, gymId: action.gymId })
                ];
              }),
              catchError((error) => {
                return of(AdminsActions.deleteAdminFailure({ error }));
              })
            );
        })
      )
  );


  public $updateAdmin = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AdminsActions.updateAdmin),
        switchMap((action) => {
          return this.adminsService
            .updateAdmin(action.id, action.admin, action.token)
            .pipe(
              switchMap((adminDetailsBo: AdminItemBo) => {
                return [
                  AdminsActions.updateAdminSuccess(),
                  AdminsActions.resetAdminDetailsStatus(),
                  AdminsActions.loadAdmins({ token: action.token, gymId: adminDetailsBo.gymId })
                ];
              }),
              catchError((error) => {
                return of(AdminsActions.updateAdminFailure({ error }));
              })
            );
        })
      )
  );

  public $createAdmin = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AdminsActions.createAdmin),
        switchMap((action) => {
          return this.adminsService
            .createAdmin(action.admin, action.token)
            .pipe(
              switchMap((admin: AdminItemBo) => {
                return [
                  AdminsActions.createAdminSuccess(),
                  AdminsActions.resetAdminDetailsStatus(),
                  AdminsActions.loadAdmins({ token: action.token, gymId: action.admin.gymId }),
                ];
              }),
              catchError((error) => {
                return of(AdminsActions.createAdminFailure({ error }));
              })
            );
        })
      )
  );

  public $updateAdminPassword = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminsActions.updateAdminPassword),
      switchMap((action) => {
        return this.adminsService
          .updateAdminPasswordByHim(action.id, action.passwords, action.token)
          .pipe(
            map(() => AdminsActions.updateAdminPasswordSuccess()),
            catchError((error) =>
              of(AdminsActions.updateAdminPasswordFailure({ error }))
            )
          );
      })
    )
  );

  public $updatePasswordBySuperAdmin = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminsActions.updateAdminPasswordBySuperAdmin),
      switchMap((action) => {
        return this.adminsService
          .updatePasswordBySuperAdmin(action.id, action.newPassword, action.token)
          .pipe(
            map(() => AdminsActions.updateAdminPasswordSuccess()),
            catchError((error) =>
              of(AdminsActions.updateAdminPasswordBySuperAdminFailure({ error }))
            )
          );
      })
    )
  );
}
