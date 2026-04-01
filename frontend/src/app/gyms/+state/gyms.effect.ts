import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { GymsService } from '../service/gyms.service';
import { GymDetailsBo } from '../bo/gym-details.bo';
import { inject, Injectable } from '@angular/core';
import { GymsActions } from './gyms.action';
import { GymItemBo } from '../bo/gym-item.bo';

@Injectable()
export class GymsEffect {
  private actions$ = inject(Actions);
  private gymsService = inject(GymsService);
  public loadGyms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GymsActions.loadGyms),
      switchMap((action) =>
        this.gymsService.getGyms(action.token).pipe(
          map((gymsList: GymItemBo[]) =>
            GymsActions.loadGymsSuccess({ gyms: gymsList })
          ),
          catchError((error) =>
            of(GymsActions.loadGymsFailure({ error }))
          )
        )
      )
    )
  );

  public $loadGymDetails = createEffect(() =>
    this.actions$
      .pipe(
        ofType(GymsActions.loadGymDetails),
        switchMap((action) => {
          return this.gymsService
            .getGymDetails(action.id, action.token)
            .pipe(
              map((gymDetails: GymDetailsBo) => {
                return GymsActions.loadGymDetailsSuccess({ gym: gymDetails });
              }),
              catchError((error) => {
                return of(GymsActions.loadGymDetailsFailure({ error: error }));
              })
            );
        })
      ));

  public $deleteGym = createEffect(() =>
    this.actions$
      .pipe(
        ofType(GymsActions.deleteGym),
        switchMap((action) => {
          return this.gymsService
            .deleteGym(action.id, action.token)
            .pipe(
              switchMap(() => {
                return [
                  GymsActions.deleteGymSuccess(),
                  GymsActions.resetGymDetailsStatus(),
                  GymsActions.loadGyms({ token: action.token })
                ];
              }),
              catchError((error) => {
                return of(GymsActions.deleteGymFailure({ error }));
              })
            );
        })
      )
  );


  public $updateGym = createEffect(() =>
    this.actions$
      .pipe(
        ofType(GymsActions.updateGym),
        switchMap((action) => {
          return this.gymsService
            .updateGym(action.id, action.gym, action.token)
            .pipe(
              switchMap((gymDetailsBo: GymDetailsBo) => {
                return [
                  GymsActions.updateGymSuccess(),
                  GymsActions.resetGymDetailsStatus(),
                  GymsActions.loadGyms({ token: action.token })
                ];
              }),
              catchError((error) => {
                return of(GymsActions.updateGymFailure({ error }));
              })
            );
        })
      )
  );

  public $createGym = createEffect(() =>
    this.actions$
      .pipe(
        ofType(GymsActions.createGym),
        switchMap((action) => {
          return this.gymsService
            .createGym(action.gym, action.token)
            .pipe(
              switchMap((gym: GymDetailsBo) => {
                return [
                  GymsActions.createGymSuccess(),
                  GymsActions.resetGymDetailsStatus(),
                  GymsActions.loadGyms({ token: action.token }),
                ];
              }),
              catchError((error) => {
                return of(GymsActions.createGymFailure({ error }));
              })
            );
        })
      )
  );
}
