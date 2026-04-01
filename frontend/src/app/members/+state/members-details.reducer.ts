import { Action, createReducer, on } from '@ngrx/store';
import { MemberDetailsBo } from '../bo/member-details.bo';
import { MembersStatusEnum } from './enums/members-status.enum';
import { MembersActions } from './members.action';

export const MEMBER_DETAILS_KEY = 'memberDetailsKey';

export interface MemberDetailsState {
  readonly [MEMBER_DETAILS_KEY]: MemberDetailsBo | null;
  readonly status: MembersStatusEnum;
  readonly error: Error | null;
}

const initialMemberDetailsState: MemberDetailsState = {
  [MEMBER_DETAILS_KEY]: null,
  status: MembersStatusEnum.pending,
  error: null
};
export const memberDetailsReducer = createReducer<MemberDetailsState, Action>(initialMemberDetailsState,
  on(MembersActions.resetMemberDetailsStatus, (state) => {
      return {
        ...state,
        status: MembersStatusEnum.pending
      };
    }
  ),

  on(MembersActions.loadMemberDetails, (state) => {
      return {
        ...state,
        status: MembersStatusEnum.loading
      };
    }
  ),
  on(MembersActions.loadMemberDetailsSuccess, (state: MemberDetailsState, { member }) => {
      return {
        ...state,
        [MEMBER_DETAILS_KEY]: member,
        status: MembersStatusEnum.loadDetailsSuccess
      };
    }
  ),
  on(MembersActions.loadMemberDetailsFailure, (state: MemberDetailsState, { error }) => {
      return {
        ...state,
        status: MembersStatusEnum.loadError,
        error: error
      };
    }
  ),

  on(MembersActions.createMember, (state) => ({
    ...state,
    status: MembersStatusEnum.loading
  })),
  on(MembersActions.createMemberSuccess, (state) => ({
    ...state,
    status: MembersStatusEnum.createSuccess
  })),
  on(MembersActions.createMemberFailure, (state, { error }) => ({
    ...state,
    error,
    status: MembersStatusEnum.createFailure
  })),

  on(MembersActions.updateMember, (state) => ({
    ...state,
    status: MembersStatusEnum.loading
  })),
  on(MembersActions.updateMemberSuccess, (state) => ({
    ...state,
    status: MembersStatusEnum.updateSuccess
  })),
  on(MembersActions.updateMemberFailure, (state, { error }) => ({
    ...state,
    error,
    status: MembersStatusEnum.updateFailure
  })),

  on(MembersActions.deleteMember, (state) => ({
    ...state,
    status: MembersStatusEnum.loading
  })),
  on(MembersActions.deleteMemberSuccess, (state) => ({
    ...state,
    status: MembersStatusEnum.deleteSuccess
  })),
  on(MembersActions.deleteMemberFailure, (state, { error }) => ({
    ...state,
    error,
    status: MembersStatusEnum.deleteFailure
  }))
);
