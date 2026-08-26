import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import { ApiActions } from './api.actions';
import * as ApiModel from '../../models/api.model';
import { appStateFeature } from '../app-state/app-state.reducer';
import { ApiService } from './api.service';

const BASE_COLUMNS = 'overall_ux_rating_avg,login_delay_avg,cpu_used_percent,memory_used_percent';

export const loadApiDataEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store), api = inject(ApiService)) =>
    actions$.pipe(
      ofType(ApiActions.loadApiData),

      withLatestFrom(store.select(appStateFeature.selectSelectedDate)),

      switchMap(([action, date]) => {
        const { userName, nodeName } = action;

        const payload: ApiModel.ApiDataRequest = {
          inspector: '0',
          basis: 'users,machines',
          columns: BASE_COLUMNS,
          date,
          sort_col: 'user_name',
          sort_order: '1',

          ...(userName &&
            nodeName && {
              user_name: userName,
              node_name: nodeName,
              resolution: 'cid',
            }),
        };

        return api.load(payload).pipe(
          map((data) => ApiActions.loadApiDataSuccess({ data })),

          catchError((error) =>
            of(
              ApiActions.loadApiDataFailure({
                error: error instanceof Error ? error.message : 'Unable to load API data',
              }),
            ),
          ),
        );
      }),
    ),
  { functional: true },
);
