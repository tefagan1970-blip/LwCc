import { describe, expect, it } from 'vitest';

import * as ApiModel from '../../models/api.model';
import { ApiActions } from './api.actions';
import { ApiState, apiFeature } from './api.reducer';

describe('apiFeature reducer', () => {
  const initialState: ApiState = {
    data: null,
    loading: false,
    error: null,
  };

  const response = {
    columns: 'overall_ux_rating_avg,login_delay_avg,cpu_used_percent,memory_used_percent',
    table: [],
  } as unknown as ApiModel.ApiResponse;

  it('should return the initial state for an unknown action', () => {
    const action = {
      type: 'Unknown',
    };

    const state = apiFeature.reducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('should set loading true when API data is requested', () => {
    const action = ApiActions.loadApiData({});

    const state = apiFeature.reducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.data).toBeNull();
  });

  it('should store API data on success', () => {
    const loadingState: ApiState = {
      ...initialState,
      loading: true,
    };

    const action = ApiActions.loadApiDataSuccess({
      data: response,
    });

    const state = apiFeature.reducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.data).toEqual(response);
  });

  it('should stop loading and store error on failure', () => {
    const loadingState: ApiState = {
      ...initialState,
      loading: true,
    };

    const action = ApiActions.loadApiDataFailure({
      error: 'API request failed',
    });

    const state = apiFeature.reducer(loadingState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toBe('API request failed');
    expect(state.data).toBeNull();
  });

  it('should clear an API error', () => {
    const errorState: ApiState = {
      ...initialState,
      error: 'API request failed',
    };

    const action = ApiActions.clearApiError();

    const state = apiFeature.reducer(errorState, action);

    expect(state.error).toBeNull();
  });

  it('should preserve existing data when a refresh starts', () => {
    const existingState: ApiState = {
      data: response,
      loading: false,
      error: null,
    };

    const action = ApiActions.loadApiData({});

    const state = apiFeature.reducer(existingState, action);

    expect(state.loading).toBe(true);
    expect(state.data).toEqual(response);
  });

  it('should clear a previous error when a new request starts', () => {
    const errorState: ApiState = {
      data: null,
      loading: false,
      error: 'Previous error',
    };

    const action = ApiActions.loadApiData({});

    const state = apiFeature.reducer(errorState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });
});
