import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Requested': props<{ username: string }>(),
    'Login Succeeded': props<{ username: string }>(),
    'Login Failed': props<{ error: string }>(),
    Logout: emptyProps(),
    'Clear Auth Error': emptyProps(),
  },
});
