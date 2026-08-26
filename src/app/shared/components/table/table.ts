import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import * as ApiModel from '../../../core/models/api.model';

@Component({
  selector: 'app-table',
  imports: [MatTableModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  readonly columns = input.required<(keyof ApiModel.ApiTableRow)[]>();
  readonly rowSelected = output<ApiModel.ApiTableRow>();
  readonly xref = input.required<ApiModel.Xref>();
  readonly rows = input.required<ApiModel.ApiTableRow[]>();
  readonly clickable = input(false);

  rowClicked(row: ApiModel.ApiTableRow): void {
    if (this.clickable()) {
      this.rowSelected.emit(row);
    }
  }
}
