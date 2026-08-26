import { createActionGroup, emptyProps, props } from '@ngrx/store';
import * as ApiModel from '../../models/api.model';

export const ApiActions = createActionGroup({
  source: 'Api',
  events: {
    'Load Api Data': props<{ userName?: string; nodeName?: string }>(),
    'Load Api Data Success': props<{ data: ApiModel.ApiResponse }>(),
    'Load Api Data Failure': props<{ error: string }>(),
    'Clear Api Error': emptyProps(),
  },
});
