import { createFeature, createReducer, on } from '@ngrx/store';

import * as ApiModel from '../../models/api.model';
import { ApiActions } from './api.actions';

export interface ApiState {
  data: ApiModel.ApiResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: null,
  loading: false,
  error: null,
};

export const apiFeature = createFeature({
  name: 'api',

  reducer: createReducer(
    initialState,

    on(ApiActions.loadApiData, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),

    on(ApiActions.loadApiDataSuccess, (state, { data }) => ({
      ...state,
      data,
      loading: false,
      error: null,
    })),

    on(ApiActions.loadApiDataFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(ApiActions.clearApiError, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
  ),
});
