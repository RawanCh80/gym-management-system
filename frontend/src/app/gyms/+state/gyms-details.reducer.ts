import { Action, createReducer, on } from '@ngrx/store';
import { GymDetailsBo } from '../bo/gym-details.bo';
import { GymStatusEnum } from './enums/gym-status.enum';
import { GymsActions } from './gyms.action';

export const GYM_DETAILS_KEY = 'gymDetailsKey';

export interface GymDetailsState {
  readonly [GYM_DETAILS_KEY]: GymDetailsBo | null;
  readonly status: GymStatusEnum;
  readonly error: Error | null;
}

const initialGymDetailsState: GymDetailsState = {
  [GYM_DETAILS_KEY]: null,
  status: GymStatusEnum.pending,
  error: null
};
export const gymDetailsReducer = createReducer<GymDetailsState, Action>(initialGymDetailsState,
  on(GymsActions.resetGymDetailsStatus, (state) => {
      return {
        ...state,
        status: GymStatusEnum.pending
      };
    }
  ),

  on(GymsActions.loadGymDetails, (state) => {
      return {
        ...state,
        status: GymStatusEnum.loading
      };
    }
  ),
  on(GymsActions.loadGymDetailsSuccess, (state: GymDetailsState, { gym }) => {
      return {
        ...state,
        [GYM_DETAILS_KEY]: gym,
        status: GymStatusEnum.loadDetailsSuccess
      };
    }
  ),
  on(GymsActions.loadGymDetailsFailure, (state: GymDetailsState, { error }) => {
      return {
        ...state,
        status: GymStatusEnum.loadError,
        error: error
      };
    }
  ),

  on(GymsActions.createGym, (state) => ({
    ...state,
    status: GymStatusEnum.loading
  })),
  on(GymsActions.createGymSuccess, (state) => ({
    ...state,
    status: GymStatusEnum.createSuccess
  })),
  on(GymsActions.createGymFailure, (state, { error }) => ({
    ...state,
    error,
    status: GymStatusEnum.createFailure
  })),

  on(GymsActions.updateGym, (state) => ({
    ...state,
    status: GymStatusEnum.loading
  })),
  on(GymsActions.updateGymSuccess, (state) => ({
    ...state,
    status: GymStatusEnum.updateSuccess
  })),
  on(GymsActions.updateGymFailure, (state, { error }) => ({
    ...state,
    error,
    status: GymStatusEnum.updateFailure
  })),

  on(GymsActions.deleteGym, (state) => ({
    ...state,
    status: GymStatusEnum.loading
  })),
  on(GymsActions.deleteGymSuccess, (state) => ({
    ...state,
    status: GymStatusEnum.deleteSuccess
  })),
  on(GymsActions.deleteGymFailure, (state, { error }) => ({
    ...state,
    error,
    status: GymStatusEnum.deleteFailure
  }))
);
