import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as ApiModel from '../../core/models/api.model';
import { ApiActions } from '../../core/store/api/api.actions';
import { apiFeature } from '../../core/store/api/api.reducer';
import { appStateFeature } from '../../core/store/app-state/app-state.reducer';
import { authFeature } from '../../core/store/auth/auth.reducer';

import { DateRangeSelect } from '../../shared/components/date-range-select/date-range-select';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';
import { Table } from '../../shared/components/table/table';

@Component({
  selector: 'app-data-page',
  imports: [DateRangeSelect, PageWrapper, Table],
  templateUrl: './data-page.html',
  styleUrl: './data-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataPage {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);


  private lastLoadKey: string | null = null;

  readonly xref = computed<ApiModel.Xref>(() => this.response()?.xref ?? {});

  readonly selectedDate = this.store.selectSignal(appStateFeature.selectSelectedDate);

  readonly username = this.store.selectSignal(authFeature.selectUsername);

  readonly response = this.store.selectSignal(apiFeature.selectData);

  readonly loading = this.store.selectSignal(apiFeature.selectLoading);

  readonly error = this.store.selectSignal(apiFeature.selectError);

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly userName = computed(() => this.routeParams().get('userName'));

  readonly nodeName = computed(() => this.routeParams().get('nodeName'));

  readonly mode = computed<'list' | 'detail'>(() =>
    this.userName() && this.nodeName() ? 'detail' : 'list',
  );

  readonly detailsUserName = computed(() => this.userName() ?? '');

  readonly rows = computed<ApiModel.ApiResponse['table']>(() =>
    (this.response()?.table ?? []).filter((row) => Object.keys(row).length > 0),
  );

  readonly columns = computed<(keyof ApiModel.ApiTableRow)[]>(() => {
    const columns = this.response()?.columns;

    const firstColumn: keyof ApiModel.ApiTableRow =
      this.mode() === 'detail' ? 'end_date' : 'user_name';

    return [firstColumn, ...(columns?.split(',') ?? [])] as (keyof ApiModel.ApiTableRow)[];
  });

  constructor() {
    effect(() => {
      const username = this.username();
      const selectedDate = this.selectedDate();
      const userName = this.userName();
      const nodeName = this.nodeName();

      if (!username || !selectedDate) {
        return;
      }


      const loadKey = [username, selectedDate, userName ?? '', nodeName ?? ''].join('|');

      if (loadKey === this.lastLoadKey) {
        return;
      }

      this.lastLoadKey = loadKey;


      untracked(() => {
        if (userName && nodeName) {
          this.store.dispatch(
            ApiActions.loadApiData({
              userName,
              nodeName,
            }),
          );

          return;
        }

        this.store.dispatch(ApiActions.loadApiData({}));
      });
    });
  }

  rowClicked(row: ApiModel.ApiTableRow): void {
    void this.router.navigate(['/apidata', row.user_name, row.node_name]);
  }
}
