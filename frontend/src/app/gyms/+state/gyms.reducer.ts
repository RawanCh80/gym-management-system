import { Action, createReducer, on } from '@ngrx/store';
import { GymsActions } from './gyms.action';
import { GymStatusEnum } from './enums/gym-status.enum';
import { GymItemBo } from '../bo/gym-item.bo';

export const GYMS_KEY = 'gymsKey';

export interface GymsState {
  readonly [GYMS_KEY]: GymItemBo[];
  readonly status: GymStatusEnum;
  readonly error: Error | null;
}

const initialGymsState: GymsState = {
  [GYMS_KEY]: [],
  status: GymStatusEnum.pending,
  error: null
};
export const gymsReducer = createReducer<GymsState, Action>(initialGymsState,
  on(GymsActions.loadGyms, (state: GymsState) => {
    return {
      ...state,
      status: GymStatusEnum.loading
    };
  }),
  on(GymsActions.loadGymsSuccess, (state: GymsState, { gyms }) => {
    return {
      ...state,
      [GYMS_KEY]: gyms,
      status: GymStatusEnum.loadSuccess
    };
  }),
  on(GymsActions.loadGymsFailure, (status: GymsState, { error }) => {
      return {
        ...status,
        status: GymStatusEnum.loadError,
        error: error
      };
    }
  )
);


