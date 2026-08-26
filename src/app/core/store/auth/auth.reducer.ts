import { createFeature, createReducer, on } from '@ngrx/store';

import { AuthActions } from './auth.actions';

export interface AuthState {
  username: string | null;
  loggingIn: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  loggingIn: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(AuthActions.loginRequested, (state) => {
      return { ...state, loggingIn: true, error: null };
    }),
    on(AuthActions.loginSucceeded, (state, { username }) => {
      return {
        ...state,
        username,
        loggingIn: false,
        error: null,
      };
    }),
    on(AuthActions.loginFailed, (state, { error }) => ({ ...state, loggingIn: false, error })),
    on(AuthActions.logout, () => initialState),

    on(AuthActions.clearAuthError, (state) => ({
      ...state,
      error: null,
      loggingIn: false,
    })),
  ),
});
