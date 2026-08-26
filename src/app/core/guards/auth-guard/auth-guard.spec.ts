import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { authGuard } from './auth-guard';
import { authFeature } from '../../store/auth/auth.reducer';

describe('authGuard', () => {
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        {
          provide: Router,
          useValue: {
            createUrlTree: vi.fn((commands: string[]) => ({ commands }) as unknown as UrlTree),
          },
        },
      ],
    });

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });

  it('should allow navigation when username exists', async () => {
    store.overrideSelector(authFeature.selectUsername, 'test.user');

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    const allowed = await firstValueFrom(result as ReturnType<typeof store.select>);

    expect(allowed).toBe(true);
  });

  it('should redirect to login when username is null', async () => {
    store.overrideSelector(authFeature.selectUsername, null);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    const redirect = await firstValueFrom(result as ReturnType<typeof store.select>);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);

    expect(redirect).toEqual({
      commands: ['/login'],
    });
  });
});
