import { createActionGroup, props } from '@ngrx/store';

export const AppStateActions = createActionGroup({
  source: 'App State',
  events: {
    'Set Date': props<{ date: string }>(),
  },
});
