import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';

import { apiFeature } from './core/store/api/api.reducer';
import * as apiEffects from './core/store/api/api.effects';

import { appStateFeature } from './core/store/app-state/app-state.reducer';

import { authFeature } from './core/store/auth/auth.reducer';
import * as authEffects from './core/store/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),

    provideStore(),
    provideStoreDevtools({
      maxAge: 25,
    }),

    provideState(authFeature),
    provideState(apiFeature),
    provideState(appStateFeature),

    provideEffects(authEffects, apiEffects),
  ],
};
