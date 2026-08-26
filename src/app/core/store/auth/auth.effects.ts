import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, timer } from 'rxjs';

import { AuthActions } from './auth.actions';

export const loginEffect = createEffect(
  (actions$ = inject(Actions)) =>
    actions$.pipe(
      ofType(AuthActions.loginRequested),

      switchMap(({ username }) =>
        timer(1000).pipe(map(() => AuthActions.loginSucceeded({ username }))),
      ),
    ),
  { functional: true },
);

export const loginNavigationEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.loginSucceeded),
      tap(() => void router.navigate(['/apidata'])),
    ),
  { functional: true, dispatch: false },
);

export const logoutNavigationEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) =>
    actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => void router.navigate(['/login'])),
    ),
  { functional: true, dispatch: false },
);
