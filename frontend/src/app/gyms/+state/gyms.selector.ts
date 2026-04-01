import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GYMS_KEY, GymsState } from './gyms.reducer';
import { GYM_DETAILS_KEY, GymDetailsState } from './gyms-details.reducer';

export const selectGymsFeature = createFeatureSelector<GymsState>(GYMS_KEY);
export const selectGymsList = createSelector(selectGymsFeature, (state: GymsState) => state);

export const selectGymDetailsFeature = createFeatureSelector<GymDetailsState>(GYM_DETAILS_KEY);
export const selectGymDetails = createSelector(selectGymDetailsFeature, (state: GymDetailsState) => state);

