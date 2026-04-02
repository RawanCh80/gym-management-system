import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ADMINS_KEY, AdminsState } from './admins.reducer';
import { ADMIN_DETAILS_KEY, AdminDetailsState } from './admins-details.reducer';

export const selectAdminsFeature = createFeatureSelector<AdminsState>(ADMINS_KEY);
export const selectAdminsList = createSelector(selectAdminsFeature, (state: AdminsState) => state);

export const selectAdminDetailsFeature = createFeatureSelector<AdminDetailsState>(ADMIN_DETAILS_KEY);
export const selectAdminDetails = createSelector(selectAdminDetailsFeature, (state: AdminDetailsState) => state);

