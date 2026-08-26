import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { beforeEach, describe, expect, it } from 'vitest';

import { LoadingModal, LoadingModalData } from './loading-modal';

describe('LoadingModal', () => {
  let fixture: ComponentFixture<LoadingModal>;
  let component: LoadingModal;

  const dialogData: LoadingModalData = {
    title: 'Loading API Data',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingModal],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingModal);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose dialog data', () => {
    expect(component.data.title).toBe('Loading API Data');
  });

  it('should render loading title', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.loading-title')?.textContent).toContain('Loading API Data');
  });
});
