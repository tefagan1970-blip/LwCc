import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as ApiModel from '../../core/models/api.model';
import { ApiActions } from '../../core/store/api/api.actions';
import { apiFeature } from '../../core/store/api/api.reducer';
import { appStateFeature } from '../../core/store/app-state/app-state.reducer';
import { authFeature } from '../../core/store/auth/auth.reducer';

import { DataPage } from './data-page';

describe('DataPage', () => {
  let fixture: ComponentFixture<DataPage>;
  let component: DataPage;
  let store: MockStore;

  let routeParams$: BehaviorSubject<ParamMap>;

  const routerMock = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  const xref: ApiModel.Xref = {
    user_name: 'User',
    user_id: 'User ID',
    node_name: 'Machine Name',
    node_id: 'Machine ID',
    overall_ux_rating_avg: 'UX Score',
    login_delay_avg: 'Login Delay',
    cpu_used_percent: 'CPU Used %',
    memory_used_percent: 'Memory Used %',
  };

  const apiResponse = {
    columns: 'overall_ux_rating_avg,login_delay_avg,cpu_used_percent,memory_used_percent',

    table: [
      {
        user_name: 'abigail.brown',
        user_id: '5158',
        node_name: 'vdipcoip-01.lab.lwl.corp',
        node_id: '2512',
        overall_ux_rating_avg: 'B-',
        login_delay_avg: '67',
        cpu_used_percent: '39.9',
        memory_used_percent: '66.5',
      },
    ],

    xref,
  } as unknown as ApiModel.ApiResponse;

  beforeEach(async () => {
    vi.clearAllMocks();

    routeParams$ = new BehaviorSubject<ParamMap>(convertToParamMap({}));

    await TestBed.configureTestingModule({
      imports: [DataPage],

      providers: [
        provideZonelessChangeDetection(),

        provideMockStore({
          selectors: [
            {
              selector: authFeature.selectUsername,
              value: 'test.user',
            },
            {
              selector: appStateFeature.selectSelectedDate,
              value: '1 weeks ago',
            },
            {
              selector: apiFeature.selectData,
              value: apiResponse,
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
          provide: ActivatedRoute,
          useValue: {
            paramMap: routeParams$.asObservable(),
            snapshot: {
              paramMap: routeParams$.value,
            },
          },
        },

        {
          provide: Router,
          useValue: routerMock,
        },
      ],
    })
      .overrideComponent(DataPage, {
        set: {
          imports: [],
          template: '',
        },
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(DataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();

    expect(component).toBeTruthy();
  });

  it('should default to list mode without route parameters', () => {
    createComponent();

    expect(component.mode()).toBe('list');
    expect(component.userName()).toBeNull();
    expect(component.nodeName()).toBeNull();
  });

  it('should use detail mode when userName and nodeName are present', () => {
    routeParams$.next(
      convertToParamMap({
        userName: 'abigail.brown',
        nodeName: 'vdipcoip-01.lab.lwl.corp',
      }),
    );

    createComponent();

    expect(component.mode()).toBe('detail');
    expect(component.userName()).toBe('abigail.brown');
    expect(component.nodeName()).toBe('vdipcoip-01.lab.lwl.corp');
    expect(component.detailsUserName()).toBe('abigail.brown');
  });

  it('should stay in list mode when only userName is present', () => {
    routeParams$.next(
      convertToParamMap({
        userName: 'abigail.brown',
      }),
    );

    createComponent();

    expect(component.mode()).toBe('list');
    expect(component.userName()).toBe('abigail.brown');
    expect(component.nodeName()).toBeNull();
  });

  it('should expose rows from the API response', () => {
    createComponent();

    expect(component.rows()).toHaveLength(1);

    expect(component.rows()[0]).toEqual(apiResponse.table[0]);
  });

  it('should expose xref from the API response', () => {
    createComponent();

    expect(component.xref()).toEqual(xref);

    expect(component.xref()['user_name']).toBe('User');

    expect(component.xref()['overall_ux_rating_avg']).toBe('UX Score');
  });

  it('should return an empty xref when no API response exists', () => {
    store.overrideSelector(apiFeature.selectData, null);

    createComponent();

    expect(component.xref()).toEqual({});
  });

  it('should put user_name first in list mode', () => {
    createComponent();

    expect(component.columns()).toEqual([
      'user_name',
      'overall_ux_rating_avg',
      'login_delay_avg',
      'cpu_used_percent',
      'memory_used_percent',
    ]);
  });

  it('should put end_date first in detail mode', () => {
    routeParams$.next(
      convertToParamMap({
        userName: 'abigail.brown',
        nodeName: 'machine-01',
      }),
    );

    createComponent();

    expect(component.columns()).toEqual([
      'end_date',
      'overall_ux_rating_avg',
      'login_delay_avg',
      'cpu_used_percent',
      'memory_used_percent',
    ]);
  });

  it('should filter empty row objects without mutating the response', () => {
    const rows = [
      {},
      {
        user_name: 'abigail.brown',
        node_name: 'machine-01',
      },
      {},
    ];

    const response = {
      ...apiResponse,
      table: rows,
    } as unknown as ApiModel.ApiResponse;

    store.overrideSelector(apiFeature.selectData, response);

    createComponent();

    expect(component.rows()).toHaveLength(1);

    expect(component.rows()[0]).toEqual({
      user_name: 'abigail.brown',
      node_name: 'machine-01',
    });

    expect(response.table).toHaveLength(3);
  });

  it('should dispatch a list request in list mode', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(ApiActions.loadApiData({}));
  });

  it('should dispatch a filtered request in detail mode', async () => {
    routeParams$.next(
      convertToParamMap({
        userName: 'abigail.brown',
        nodeName: 'vdipcoip-01.lab.lwl.corp',
      }),
    );

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ApiActions.loadApiData({
        userName: 'abigail.brown',
        nodeName: 'vdipcoip-01.lab.lwl.corp',
      }),
    );
  });

  it('should dispatch a list request when only userName is present', async () => {
    routeParams$.next(
      convertToParamMap({
        userName: 'abigail.brown',
      }),
    );

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(component.mode()).toBe('list');
    expect(component.userName()).toBe('abigail.brown');
    expect(component.nodeName()).toBeNull();

    expect(dispatchSpy).toHaveBeenCalledWith(ApiActions.loadApiData({}));
  });

  it('should not dispatch duplicate request for unchanged state', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should reload when selected date changes', async () => {
    const dateSelector = store.overrideSelector(appStateFeature.selectSelectedDate, '1 weeks ago');

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    dispatchSpy.mockClear();

    dateSelector.setResult('today');
    store.refreshState();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(dispatchSpy).toHaveBeenCalledWith(ApiActions.loadApiData({}));
  });

  it('should not load data when username is missing', async () => {
    store.overrideSelector(authFeature.selectUsername, null);

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not load data when selected date is missing', async () => {
    store.overrideSelector(appStateFeature.selectSelectedDate, '');

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    createComponent();

    await fixture.whenStable();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should navigate to detail when a row is selected', () => {
    createComponent();

    const row = {
      user_name: 'abigail.brown',
      node_name: 'machine-01',
    } as ApiModel.ApiTableRow;

    component.rowClicked(row);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/apidata', 'abigail.brown', 'machine-01']);
  });
});
