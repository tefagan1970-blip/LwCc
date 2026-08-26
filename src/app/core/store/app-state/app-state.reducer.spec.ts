import { describe, expect, it } from 'vitest';

import { AppStateActions } from './app-state.actions';
import { AppState, appStateFeature } from './app-state.reducer';

describe('appStateFeature reducer', () => {
  const initialState: AppState = {
    selectedDate: '1 weeks ago',
  };

  it('should return the initial state for an unknown action', () => {
    const state = appStateFeature.reducer(initialState, { type: 'Unknown' });

    expect(state).toEqual(initialState);
  });

  it('should update the selected date', () => {
    const state = appStateFeature.reducer(
      initialState,
      AppStateActions.setDate({
        date: '1 months ago',
      }),
    );

    expect(state.selectedDate).toBe('1 months ago');
  });

  it('should not mutate the original state', () => {
    const state = appStateFeature.reducer(
      initialState,
      AppStateActions.setDate({
        date: '3 months ago',
      }),
    );

    expect(state).not.toBe(initialState);
    expect(initialState.selectedDate).toBe('1 weeks ago');
    expect(state.selectedDate).toBe('3 months ago');
  });
});
