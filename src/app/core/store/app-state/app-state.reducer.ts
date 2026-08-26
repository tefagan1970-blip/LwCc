import { createFeature, createReducer, on } from '@ngrx/store';

import { AppStateActions } from './app-state.actions';

export interface AppState {
  selectedDate: string;
}

const initialState: AppState = {
  selectedDate: '1 weeks ago',
};

export const appStateFeature = createFeature({
  name: 'appState',

  reducer: createReducer(
    initialState,

    on(AppStateActions.setDate, (state, { date }) => {
      return {
        ...state,
        selectedDate: date,
      };
    }),
  ),
});
