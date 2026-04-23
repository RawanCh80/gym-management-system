import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MembersEffect } from './members/+state/members.effect';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { MEMBERS_KEY, membersReducer } from './members/+state/members.reducer';
import { MEMBER_DETAILS_KEY, memberDetailsReducer } from './members/+state/members-details.reducer';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { GymsEffect } from './gyms/+state/gyms.effect';
import { GYMS_KEY, gymsReducer } from './gyms/+state/gyms.reducer';
import { GYM_DETAILS_KEY, gymDetailsReducer } from './gyms/+state/gyms-details.reducer';
import { ADMINS_KEY, adminsReducer } from './admins/+state/admins.reducer';
import { ADMIN_DETAILS_KEY, adminDetailsReducer } from './admins/+state/admins-details.reducer';
import { AdminsEffect } from './admins/+state/admins.effect';

export function initializeFaIconLibrary(library: FaIconLibrary) {
  return () => {
    library.addIconPacks(fas, far);
  };
}

export const bootstrapEffectList = [
  MembersEffect,
  GymsEffect,
  AdminsEffect
]

export const reducers = {
  [MEMBER_DETAILS_KEY]: memberDetailsReducer,
  [MEMBERS_KEY]: membersReducer,
  [GYMS_KEY]: gymsReducer,
  [GYM_DETAILS_KEY]: gymDetailsReducer,
  [ADMINS_KEY]: adminsReducer,
  [ADMIN_DETAILS_KEY]: adminDetailsReducer
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideRouter(routes),
    provideEffects(bootstrapEffectList),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFaIconLibrary,
      deps: [FaIconLibrary],
      multi: true
    }
  ]
};
