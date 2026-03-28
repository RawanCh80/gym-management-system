import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MEMBERS_KEY, MembersState } from './members.reducer';
import { MemberDetailsState, MEMBERS_DETAILS_KEY } from './members-details.reducer';

export const selectMembersFeature = createFeatureSelector<MembersState>(MEMBERS_KEY);
export const selectMembers = createSelector(selectMembersFeature, (state: MembersState) => state);

export const selectMemberDetailsFeature = createFeatureSelector<MemberDetailsState>(MEMBERS_DETAILS_KEY);
export const selectMemberDetails = createSelector(selectMemberDetailsFeature, (state: MemberDetailsState) => state);

