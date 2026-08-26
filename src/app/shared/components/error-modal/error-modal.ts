import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ErrorModalData {
  title: string;
  error: string;
  close: () => void;
}

@Component({
  selector: 'app-error-modal',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './error-modal.html',
  styleUrl: './error-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModal {
  readonly data = inject<ErrorModalData>(MAT_DIALOG_DATA);

  close = () => {
    this.data.close();
  };
}
