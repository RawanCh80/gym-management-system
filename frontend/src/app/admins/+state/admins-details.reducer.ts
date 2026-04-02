import { Action, createReducer, on } from '@ngrx/store';
import { AdminStatusEnum } from './enums/admin-status.enum';
import { AdminsActions } from './admins.action';
import { AdminItemBo } from '../bo/admin-item.bo';

export const ADMIN_DETAILS_KEY = 'adminDetailsKey';

export interface AdminDetailsState {
  readonly [ADMIN_DETAILS_KEY]: AdminItemBo | null;
  readonly status: AdminStatusEnum;
  readonly error: Error | null;
}

const initialAdminDetailsState: AdminDetailsState = {
  [ADMIN_DETAILS_KEY]: null,
  status: AdminStatusEnum.pending,
  error: null
};
export const adminDetailsReducer = createReducer<AdminDetailsState, Action>(initialAdminDetailsState,
  on(AdminsActions.resetAdminDetailsStatus, (state) => {
      return {
        ...state,
        status: AdminStatusEnum.pending
      };
    }
  ),

  on(AdminsActions.loadAdminDetails, (state) => {
      return {
        ...state,
        status: AdminStatusEnum.loading
      };
    }
  ),
  on(AdminsActions.loadAdminDetailsSuccess, (state: AdminDetailsState, { admin }) => {
      return {
        ...state,
        [ADMIN_DETAILS_KEY]: admin,
        status: AdminStatusEnum.loadDetailsSuccess
      };
    }
  ),
  on(AdminsActions.loadAdminDetailsFailure, (state: AdminDetailsState, { error }) => {
      return {
        ...state,
        status: AdminStatusEnum.loadError,
        error: error
      };
    }
  ),

  on(AdminsActions.createAdmin, (state) => ({
    ...state,
    status: AdminStatusEnum.loading
  })),
  on(AdminsActions.createAdminSuccess, (state) => ({
    ...state,
    status: AdminStatusEnum.createSuccess
  })),
  on(AdminsActions.createAdminFailure, (state, { error }) => ({
    ...state,
    error,
    status: AdminStatusEnum.createFailure
  })),

  on(AdminsActions.updateAdmin, (state) => ({
    ...state,
    status: AdminStatusEnum.loading
  })),
  on(AdminsActions.updateAdminSuccess, (state) => ({
    ...state,
    status: AdminStatusEnum.updateSuccess
  })),
  on(AdminsActions.updateAdminFailure, (state, { error }) => ({
    ...state,
    error,
    status: AdminStatusEnum.updateFailure
  })),

  on(AdminsActions.deleteAdmin, (state) => ({
    ...state,
    status: AdminStatusEnum.loading
  })),
  on(AdminsActions.deleteAdminSuccess, (state) => ({
    ...state,
    status: AdminStatusEnum.deleteSuccess
  })),
  on(AdminsActions.deleteAdminFailure, (state, { error }) => ({
    ...state,
    error,
    status: AdminStatusEnum.deleteFailure
  }))
);
