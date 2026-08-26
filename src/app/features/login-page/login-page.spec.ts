import { Component, input, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthActions } from '../../core/store/auth/auth.actions';
import { authFeature } from '../../core/store/auth/auth.reducer';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';

import { LoginPage } from './login-page';

@Component({
  selector: 'app-page-wrapper',
  standalone: true,
  template: '<ng-content />',
})
class PageWrapperStub {
  readonly title = input('');
  readonly loadingMessage = input('');
}

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let component: LoginPage;
  let store: MockStore;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [LoginPage],

      providers: [
        provideZonelessChangeDetection(),

        provideMockStore({
          selectors: [
            {
              selector: authFeature.selectUsername,
              value: null,
            },
            {
              selector: authFeature.selectLoggingIn,
              value: false,
            },
            {
              selector: authFeature.selectError,
              value: null,
            },
          ],
        }),
      ],
    })
      .overrideComponent(LoginPage, {
        remove: {
          imports: [PageWrapper],
        },
        add: {
          imports: [PageWrapperStub],
        },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(LoginPage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render username field and sign in button', () => {
    const inputElement = fixture.nativeElement.querySelector(
      'input[formControlName="username"]',
    ) as HTMLInputElement;

    const button = fixture.nativeElement.querySelector('button.sign-in') as HTMLButtonElement;

    expect(inputElement).toBeTruthy();
    expect(button).toBeTruthy();

    expect(button.textContent?.trim()).toBe('Sign in');
  });

  it('should require a username', () => {
    const control = component.loginForm.controls.username;

    control.setValue('');

    expect(control.invalid).toBe(true);

    expect(control.hasError('required')).toBe(true);
  });

  it('should display required error after invalid submit', async () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    fixture.detectChanges();

    await fixture.whenStable();

    expect(component.loginForm.controls.username.touched).toBe(true);

    const error = fixture.nativeElement.querySelector('mat-error') as HTMLElement | null;

    expect(error).toBeTruthy();

    expect(error?.textContent?.trim()).toBe('Username is required.');
  });

  it('should dispatch loginRequested with trimmed username', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.loginForm.controls.username.setValue('  test.user  ');

    component.logIn();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.loginRequested({
        username: 'test.user',
      }),
    );
  });

  it('should submit login through the form', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.loginForm.controls.username.setValue('test.user');

    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(
      new Event('submit', {
        bubbles: true,
        cancelable: true,
      }),
    );

    fixture.detectChanges();

    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.loginRequested({
        username: 'test.user',
      }),
    );
  });

  it('should not dispatch when username is empty', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.loginForm.controls.username.setValue('');

    component.logIn();

    expect(dispatchSpy).not.toHaveBeenCalled();

    expect(component.loginForm.controls.username.touched).toBe(true);
  });

  it('should not dispatch when username contains only whitespace', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.loginForm.controls.username.setValue('   ');

    component.logIn();

    expect(dispatchSpy).not.toHaveBeenCalled();

    expect(component.loginForm.controls.username.hasError('required')).toBe(true);

    expect(component.loginForm.controls.username.touched).toBe(true);
  });

  it('should disable button while login is in progress', async () => {
    const loggingInSelector = store.overrideSelector(authFeature.selectLoggingIn, false);

    loggingInSelector.setResult(true);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button.sign-in') as HTMLButtonElement;

    expect(button.disabled).toBe(true);

    expect(button.textContent?.trim()).toBe('Signing in…');
  });

  it('should not dispatch when login is already in progress', async () => {
    const loggingInSelector = store.overrideSelector(authFeature.selectLoggingIn, false);

    loggingInSelector.setResult(true);

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.loginForm.controls.username.setValue('test.user');

    component.logIn();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
