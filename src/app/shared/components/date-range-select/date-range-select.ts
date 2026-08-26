import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';

import { AppStateActions } from '../../../core/store/app-state/app-state.actions';
import { appStateFeature } from '../../../core/store/app-state/app-state.reducer';

interface DateRangeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-date-range-select',
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './date-range-select.html',
  styleUrl: './date-range-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeSelect {
  private readonly store = inject(Store);

  readonly value = this.store.selectSignal(appStateFeature.selectSelectedDate);

  readonly options: readonly DateRangeOption[] = [
    { label: '1 Hour', value: '1 hours' },
    { label: '8 Hours', value: '8 hours' },
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This Week', value: 'this week' },
    { label: 'Last Week', value: '1 weeks ago' },
    { label: 'Last 7 Days', value: 'today and 7 days' },
    { label: 'This Month', value: 'this month' },
    { label: 'Last Month', value: '1 month ago' },
    { label: 'Last 30 Days', value: 'last 30 days' },
  ];

  selectionChanged(event: MatSelectChange): void {
    this.store.dispatch(AppStateActions.setDate({ date: event.value as string }));
  }
}
