import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthActions } from '../../../core/store/auth/auth.actions';
import { Logout } from './logout';

describe('Logout', () => {
  let fixture: ComponentFixture<Logout>;
  let component: Logout;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Logout],
      providers: [provideZonelessChangeDetection(), provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(Logout);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch logout action', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    component.logout();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });

  it('should dispatch logout when button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.logout());
  });
});
