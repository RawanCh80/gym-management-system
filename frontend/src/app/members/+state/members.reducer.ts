import { Action, createReducer, on } from '@ngrx/store';
import { MembersActions } from './members.action';
import { MembersStatusEnum } from './enums/members-status.enum';
import { MemberBo } from '../bo/member.bo';

export const MEMBERS_KEY = 'membersKey';

export interface MembersState {
  readonly [MEMBERS_KEY]: MemberBo[];
  readonly status: MembersStatusEnum;
  readonly error: Error | null;
}

const initialMembersState: MembersState = {
  [MEMBERS_KEY]: [],
  status: MembersStatusEnum.pending,
  error: null
};
export const membersReducers = createReducer<MembersState, Action>(initialMembersState,
  on(MembersActions.loadMembers, (state: MembersState) => {
    return {
      ...state,
      status: MembersStatusEnum.loading
    };
  }),
  on(MembersActions.loadMembersSuccess, (state: MembersState, { members }) => {
    return {
      ...state,
      [MEMBERS_KEY]: members,
      status: MembersStatusEnum.loadSuccess
    };
  }),
  on(MembersActions.loadMembersFailure, (status: MembersState, { error }) => {
      return {
        ...status,
        status: MembersStatusEnum.loadError,
        error: error
      };
    }
  )
);


