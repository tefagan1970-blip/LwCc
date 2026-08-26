import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiActions } from '../../../core/store/api/api.actions';
import { apiFeature } from '../../../core/store/api/api.reducer';
import { AuthActions } from '../../../core/store/auth/auth.actions';
import { authFeature } from '../../../core/store/auth/auth.reducer';

import { ErrorModal } from '../error-modal/error-modal';
import { LoadingModal } from '../loading-modal/loading-modal';
import { Logout } from '../logout/logout';
import { PageWrapper } from './page-wrapper';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: '<button type="button">Logout</button>',
})
class LogoutStub {}

describe('PageWrapper', () => {
  let fixture: ComponentFixture<PageWrapper>;
  let component: PageWrapper;
  let store: MockStore;

  let loadingDialogRef: MatDialogRef<LoadingModal>;
  let errorDialogRef: MatDialogRef<ErrorModal>;

  const dialogMock = {
    open: vi.fn(),
  };

  const titleMock = {
    setTitle: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    loadingDialogRef = {
      close: vi.fn(),
    } as unknown as MatDialogRef<LoadingModal>;

    errorDialogRef = {
      close: vi.fn(),
    } as unknown as MatDialogRef<ErrorModal>;

    dialogMock.open.mockImplementation((dialogComponent: unknown) =>
      dialogComponent === LoadingModal ? loadingDialogRef : errorDialogRef,
    );

    await TestBed.configureTestingModule({
      imports: [PageWrapper],

      providers: [
        provideZonelessChangeDetection(),

        provideMockStore({
          selectors: [
            {
              selector: authFeature.selectUsername,
              value: 'test.user',
            },
            {
              selector: authFeature.selectLoggingIn,
              value: false,
            },
            {
              selector: authFeature.selectError,
              value: null,
            },
            {
              selector: apiFeature.selectLoading,
              value: false,
            },
            {
              selector: apiFeature.selectError,
              value: null,
            },
          ],
        }),

        {
          provide: MatDialog,
          useValue: dialogMock,
        },

        {
          provide: Title,
          useValue: titleMock,
        },
      ],
    })
      .overrideComponent(PageWrapper, {
        remove: {
          imports: [Logout],
        },
        add: {
          imports: [LogoutStub],
        },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(PageWrapper);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('title', 'All Users');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the document title', async () => {
    fixture.componentRef.setInput('title', 'Details');

    fixture.detectChanges();

    await fixture.whenStable();

    expect(titleMock.setTitle).toHaveBeenCalledWith('Details');
  });

  it('should render the page title', () => {
    const title = fixture.nativeElement.querySelector('.page-title') as HTMLElement;

    expect(title).toBeTruthy();

    expect(title.textContent?.trim()).toBe('All Users');
  });

  it('should render username when logged in', () => {
    const username = fixture.nativeElement.querySelector('.username') as HTMLElement;

    expect(username).toBeTruthy();

    expect(username.textContent?.trim()).toBe('Username: test.user');
  });

  it('should render logout when username exists', () => {
    const logout = fixture.nativeElement.querySelector('app-logout');

    expect(logout).toBeTruthy();
  });

  it('should hide username and logout when no user exists', async () => {
    const usernameSelector = store.overrideSelector(authFeature.selectUsername, 'test.user');

    usernameSelector.setResult(null);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.username')).toBeNull();

    expect(fixture.nativeElement.querySelector('app-logout')).toBeNull();
  });

  it('should render projected page content', () => {
    const main = fixture.nativeElement.querySelector('.page-content') as HTMLElement;

    expect(main).toBeTruthy();
  });

  it('should open loading dialog when API is loading', async () => {
    const loadingSelector = store.overrideSelector(apiFeature.selectLoading, false);

    loadingSelector.setResult(true);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(dialogMock.open).toHaveBeenCalledWith(
      LoadingModal,
      expect.objectContaining({
        data: {
          title: 'Loading...',
        },
        disableClose: true,
        hasBackdrop: true,
      }),
    );
  });

  it('should use configured loading message', async () => {
    const loadingSelector = store.overrideSelector(apiFeature.selectLoading, false);

    fixture.componentRef.setInput('loadingMessage', 'Loading API Data');

    fixture.detectChanges();

    loadingSelector.setResult(true);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(dialogMock.open).toHaveBeenCalledWith(
      LoadingModal,
      expect.objectContaining({
        data: {
          title: 'Loading API Data',
        },
      }),
    );
  });

  it('should open loading dialog when login is in progress', async () => {
    const loggingInSelector = store.overrideSelector(authFeature.selectLoggingIn, false);

    loggingInSelector.setResult(true);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(dialogMock.open).toHaveBeenCalledWith(LoadingModal, expect.anything());
  });

  it('should close loading dialog when loading finishes', async () => {
    const loadingSelector = store.overrideSelector(apiFeature.selectLoading, false);

    loadingSelector.setResult(true);

    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    loadingSelector.setResult(false);

    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(loadingDialogRef.close).toHaveBeenCalledTimes(1);
  });

  it('should open API error dialog with API error data', async () => {
    const errorSelector = store.overrideSelector(apiFeature.selectError, null);

    errorSelector.setResult('API failed');

    store.refreshState();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(dialogMock.open).toHaveBeenCalledWith(
      ErrorModal,
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'API Error',
          error: 'API failed',
        }),
      }),
    );
  });

  it('should open auth error dialog with auth error data', async () => {
    const errorSelector = store.overrideSelector(authFeature.selectError, null);

    errorSelector.setResult('Login failed');

    store.refreshState();
    fixture.detectChanges();

    await fixture.whenStable();

    expect(dialogMock.open).toHaveBeenCalledWith(
      ErrorModal,
      expect.objectContaining({
        data: expect.objectContaining({
          title: 'Auth Error',
          error: 'Login failed',
        }),
      }),
    );
  });

  it('should clear only the API error when API error dialog closes', async () => {
    const errorSelector = store.overrideSelector(apiFeature.selectError, null);

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    errorSelector.setResult('API failed');

    store.refreshState();
    fixture.detectChanges();

    await fixture.whenStable();

    component.closeError();

    expect(errorDialogRef.close).toHaveBeenCalledTimes(1);

    expect(dispatchSpy).toHaveBeenCalledWith(ApiActions.clearApiError());

    expect(dispatchSpy).not.toHaveBeenCalledWith(AuthActions.clearAuthError());
  });

  it('should clear only the auth error when auth error dialog closes', async () => {
    const errorSelector = store.overrideSelector(authFeature.selectError, null);

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    errorSelector.setResult('Login failed');

    store.refreshState();
    fixture.detectChanges();

    await fixture.whenStable();

    component.closeError();

    expect(errorDialogRef.close).toHaveBeenCalledTimes(1);

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.clearAuthError());

    expect(dispatchSpy).not.toHaveBeenCalledWith(ApiActions.clearApiError());
  });
});
