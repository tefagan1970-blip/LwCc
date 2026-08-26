import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface LoadingModalData {
  title: string;
}

@Component({
  selector: 'app-loading-modal',
  imports: [MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './loading-modal.html',
  styleUrl: './loading-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingModal {
  readonly data = inject<LoadingModalData>(MAT_DIALOG_DATA);
}
