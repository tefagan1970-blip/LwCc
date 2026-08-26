import { describe, expect, it } from 'vitest';

import { AuthActions } from './auth.actions';
import { AuthState, authFeature } from './auth.reducer';

describe('authFeature reducer', () => {
  const initialState: AuthState = {
    username: null,
    loggingIn: false,
    error: null,
  };

  it('should set loggingIn true when login is requested', () => {
    const state = authFeature.reducer(
      initialState,
      AuthActions.loginRequested({
        username: 'test.user',
      }),
    );

    expect(state.loggingIn).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should store username when login succeeds', () => {
    const state = authFeature.reducer(
      {
        ...initialState,
        loggingIn: true,
      },
      AuthActions.loginSucceeded({
        username: 'test.user',
      }),
    );

    expect(state.username).toBe('test.user');
    expect(state.loggingIn).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should store error when login fails', () => {
    const state = authFeature.reducer(
      {
        ...initialState,
        loggingIn: true,
      },
      AuthActions.loginFailed({
        error: 'Login failed',
      }),
    );

    expect(state.loggingIn).toBe(false);
    expect(state.error).toBe('Login failed');
  });

  it('should clear auth state on logout', () => {
    const state = authFeature.reducer(
      {
        username: 'test.user',
        loggingIn: false,
        error: 'Something went wrong',
      },
      AuthActions.logout(),
    );

    expect(state).toEqual(initialState);
  });

  it('should clear auth error', () => {
    const state = authFeature.reducer(
      {
        ...initialState,
        error: 'Login failed',
      },
      AuthActions.clearAuthError(),
    );

    expect(state.error).toBeNull();
  });
});
