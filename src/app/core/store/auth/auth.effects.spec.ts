import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, firstValueFrom, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthActions } from './auth.actions';
import { loginEffect, loginNavigationEffect, logoutNavigationEffect } from './auth.effects';

describe('auth effects', () => {
  let actions$: Observable<unknown>;

  const routerMock = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),
        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should dispatch loginSucceeded after 1 second', async () => {
    vi.useFakeTimers();

    actions$ = of(
      AuthActions.loginRequested({
        username: 'test.user',
      }),
    );

    const resultPromise = firstValueFrom(TestBed.runInInjectionContext(() => loginEffect()));

    await vi.advanceTimersByTimeAsync(1000);

    const result = await resultPromise;

    expect(result).toEqual(
      AuthActions.loginSucceeded({
        username: 'test.user',
      }),
    );
  });

  it('should navigate to /apidata after login succeeds', async () => {
    actions$ = of(
      AuthActions.loginSucceeded({
        username: 'test.user',
      }),
    );

    await firstValueFrom(TestBed.runInInjectionContext(() => loginNavigationEffect()));

    expect(routerMock.navigate).toHaveBeenCalledWith(['/apidata']);
  });

  it('should navigate to /login on logout', async () => {
    actions$ = of(AuthActions.logout());

    await firstValueFrom(TestBed.runInInjectionContext(() => logoutNavigationEffect()));

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
