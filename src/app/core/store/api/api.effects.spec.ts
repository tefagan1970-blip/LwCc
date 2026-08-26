import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of, throwError, firstValueFrom } from 'rxjs';
import { describe, beforeEach, expect, it, vi } from 'vitest';

import * as ApiModel from '../../models/api.model';
import { ApiActions } from './api.actions';
import { ApiService } from './api.service';
import { loadApiDataEffect } from './api.effects';
import { appStateFeature } from '../app-state/app-state.reducer';

describe('loadApiDataEffect', () => {
  let actions$: Observable<unknown>;

  const apiServiceMock = {
    load: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions$),

        provideMockStore({
          selectors: [
            {
              selector: appStateFeature.selectSelectedDate,
              value: '1 weeks ago',
            },
          ],
        }),

        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
      ],
    });
  });

  it('should load list data using selected date', async () => {
    const response = {
      columns: 'overall_ux_rating_avg',
      table: [],
    } as unknown as ApiModel.ApiResponse;

    apiServiceMock.load.mockReturnValue(of(response));

    actions$ = of(ApiActions.loadApiData({}));

    const result = await firstValueFrom(TestBed.runInInjectionContext(() => loadApiDataEffect()));

    expect(apiServiceMock.load).toHaveBeenCalledWith(
      expect.objectContaining({
        date: '1 weeks ago',
        inspector: '0',
        basis: 'users,machines',
        sort_col: 'user_name',
        sort_order: '1',
      }),
    );

    expect(result).toEqual(
      ApiActions.loadApiDataSuccess({
        data: response,
      }),
    );
  });

  it('should add detail filters when supplied', async () => {
    const response = {
      columns: 'overall_ux_rating_avg',
      table: [],
    } as unknown as ApiModel.ApiResponse;

    apiServiceMock.load.mockReturnValue(of(response));

    actions$ = of(
      ApiActions.loadApiData({
        userName: 'abigail.brown',
        nodeName: 'machine-01',
      }),
    );

    await firstValueFrom(TestBed.runInInjectionContext(() => loadApiDataEffect()));

    expect(apiServiceMock.load).toHaveBeenCalledWith(
      expect.objectContaining({
        user_name: 'abigail.brown',
        node_name: 'machine-01',
        resolution: 'cid',
      }),
    );
  });

  it('should dispatch failure when service fails', async () => {
    apiServiceMock.load.mockReturnValue(throwError(() => new Error('Boom')));

    actions$ = of(ApiActions.loadApiData({}));

    const result = await firstValueFrom(TestBed.runInInjectionContext(() => loadApiDataEffect()));

    expect(result).toEqual(
      ApiActions.loadApiDataFailure({
        error: expect.stringContaining('Boom'),
      }),
    );
  });

  it('should use default error message when service throws a non-Error value', async () => {
    apiServiceMock.load.mockReturnValue(throwError(() => 'Boom'));

    actions$ = of(ApiActions.loadApiData({}));

    const result = await firstValueFrom(TestBed.runInInjectionContext(() => loadApiDataEffect()));

    expect(result).toEqual(
      ApiActions.loadApiDataFailure({
        error: 'Unable to load API data',
      }),
    );
  });
});
