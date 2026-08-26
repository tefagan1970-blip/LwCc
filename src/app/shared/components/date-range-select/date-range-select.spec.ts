import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AppStateActions } from '../../../core/store/app-state/app-state.actions';
import { appStateFeature } from '../../../core/store/app-state/app-state.reducer';

import { DateRangeSelect } from './date-range-select';

describe('DateRangeSelect', () => {
  let fixture: ComponentFixture<DateRangeSelect>;
  let component: DateRangeSelect;
  let store: MockStore;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeSelect],

      providers: [
        provideZonelessChangeDetection(),

        provideMockStore({
          selectors: [
            {
              selector: appStateFeature.selectSelectedDate,
              value: '1 weeks ago',
            },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);

    fixture = TestBed.createComponent(DateRangeSelect);

    component = fixture.componentInstance;

    fixture.detectChanges();

    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the selected date from store', () => {
    expect(component.value()).toBe('1 weeks ago');
  });

  it('should render the selected date', async () => {
    const select = await loader.getHarness(MatSelectHarness);

    expect(await select.getValueText()).toBe('Last Week');
  });

  it('should render all date range options', async () => {
    const select = await loader.getHarness(MatSelectHarness);

    await select.open();

    const options = await select.getOptions();

    expect(options).toHaveLength(10);

    const labels = await Promise.all(options.map((option) => option.getText()));

    expect(labels).toEqual([
      '1 Hour',
      '8 Hours',
      'Today',
      'Yesterday',
      'This Week',
      'Last Week',
      'Last 7 Days',
      'This Month',
      'Last Month',
      'Last 30 Days',
    ]);
  });

  it('should dispatch setDate when Today is selected', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const select = await loader.getHarness(MatSelectHarness);

    await select.open();

    const options = await select.getOptions({
      text: 'Today',
    });

    await options[0].click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AppStateActions.setDate({
        date: 'today',
      }),
    );
  });

  it('should dispatch Last 30 Days value', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const select = await loader.getHarness(MatSelectHarness);

    await select.open();

    const options = await select.getOptions({
      text: 'Last 30 Days',
    });

    await options[0].click();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AppStateActions.setDate({
        date: 'last 30 days',
      }),
    );
  });

  it('should update displayed selection when store date changes', async () => {
    const dateSelector = store.overrideSelector(appStateFeature.selectSelectedDate, '1 weeks ago');

    const select = await loader.getHarness(MatSelectHarness);

    dateSelector.setResult('today');

    store.refreshState();

    fixture.detectChanges();

    await fixture.whenStable();

    expect(await select.getValueText()).toBe('Today');
  });
});
