import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ErrorModal, ErrorModalData } from './error-modal';

describe('ErrorModal', () => {
  let fixture: ComponentFixture<ErrorModal>;
  let component: ErrorModal;

  const closeSpy = vi.fn();

  const dialogData: ErrorModalData = {
    title: 'API Error',
    error: 'Something went wrong',
    close: closeSpy,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ErrorModal],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorModal);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose dialog data', () => {
    expect(component.data.title).toBe('API Error');
    expect(component.data.error).toBe('Something went wrong');
  });

  it('should render title and error message', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.error-title')?.textContent).toContain('API Error');

    expect(element.querySelector('.error-message')?.textContent).toContain('Something went wrong');
  });

  it('should invoke close callback', () => {
    component.close();

    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
