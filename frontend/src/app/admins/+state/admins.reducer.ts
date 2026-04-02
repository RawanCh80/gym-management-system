import { Action, createReducer, on } from '@ngrx/store';
import { AdminsActions } from './admins.action';
import { AdminStatusEnum } from './enums/admin-status.enum';
import { AdminItemBo } from '../bo/admin-item.bo';

export const ADMINS_KEY = 'adminsKey';

export interface AdminsState {
  readonly [ADMINS_KEY]: AdminItemBo[];
  readonly status: AdminStatusEnum;
  readonly error: Error | null;
}

const initialAdminsState: AdminsState = {
  [ADMINS_KEY]: [],
  status: AdminStatusEnum.pending,
  error: null
};
export const adminsReducer = createReducer<AdminsState, Action>(initialAdminsState,
  on(AdminsActions.loadAdmins, (state: AdminsState) => {
    return {
      ...state,
      status: AdminStatusEnum.loading
    };
  }),
  on(AdminsActions.loadAdminsSuccess, (state: AdminsState, { admins }) => {
    return {
      ...state,
      [ADMINS_KEY]: admins,
      status: AdminStatusEnum.loadSuccess
    };
  }),
  on(AdminsActions.loadAdminsFailure, (status: AdminsState, { error }) => {
      return {
        ...status,
        status: AdminStatusEnum.loadError,
        error: error
      };
    }
  )
);


