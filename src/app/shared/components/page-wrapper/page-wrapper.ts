import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

import { ApiActions } from '../../../core/store/api/api.actions';
import { apiFeature } from '../../../core/store/api/api.reducer';
import { AuthActions } from '../../../core/store/auth/auth.actions';
import { authFeature } from '../../../core/store/auth/auth.reducer';

import { ErrorModal, ErrorModalData } from '../error-modal/error-modal';
import { LoadingModal, LoadingModalData } from '../loading-modal/loading-modal';
import { Logout } from '../logout/logout';

type ErrorSource = 'api' | 'auth' | null;

@Component({
  selector: 'app-page-wrapper',
  imports: [Logout, MatToolbarModule],
  templateUrl: './page-wrapper.html',
  styleUrl: './page-wrapper.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageWrapper {
  private readonly titleService = inject(Title);
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  private errorDialogRef: MatDialogRef<ErrorModal> | null = null;
  private loadingDialogRef: MatDialogRef<LoadingModal> | null = null;
  private errorSource: ErrorSource = null;

  readonly title = input('');
  readonly loadingMessage = input('Loading...');

  readonly username = this.store.selectSignal(authFeature.selectUsername);

  readonly loggingIn = this.store.selectSignal(authFeature.selectLoggingIn);

  readonly loadingApiData = this.store.selectSignal(apiFeature.selectLoading);

  readonly apiError = this.store.selectSignal(apiFeature.selectError);

  readonly authError = this.store.selectSignal(authFeature.selectError);

  readonly closeError = (): void => {
    this.errorDialogRef?.close();
    this.errorDialogRef = null;

    if (this.errorSource === 'api') {
      this.store.dispatch(ApiActions.clearApiError());
    }

    if (this.errorSource === 'auth') {
      this.store.dispatch(AuthActions.clearAuthError());
    }

    this.errorSource = null;
  };

  constructor() {
    effect(() => {
      this.titleService.setTitle(this.title());
    });

    effect(() => {
      const isLoading = this.loggingIn() || this.loadingApiData();

      const apiError = this.apiError();
      const authError = this.authError();

      if (isLoading && !this.loadingDialogRef) {
        this.loadingDialogRef = this.dialog.open<LoadingModal, LoadingModalData>(LoadingModal, {
          data: {
            title: this.loadingMessage(),
          },
          disableClose: true,
          hasBackdrop: true,
          enterAnimationDuration: '0ms',
          exitAnimationDuration: '0ms',
        });
      }

      if (!isLoading && this.loadingDialogRef) {
        this.loadingDialogRef.close();
        this.loadingDialogRef = null;
      }

      if (apiError && !this.errorDialogRef) {
        this.errorSource = 'api';

        this.errorDialogRef = this.dialog.open<ErrorModal, ErrorModalData>(ErrorModal, {
          data: {
            title: 'API Error',
            error: apiError,
            close: this.closeError,
          },
          disableClose: true,
          hasBackdrop: true,
          enterAnimationDuration: '0ms',
          exitAnimationDuration: '0ms',
        });

        return;
      }

      if (authError && !this.errorDialogRef) {
        this.errorSource = 'auth';

        this.errorDialogRef = this.dialog.open<ErrorModal, ErrorModalData>(ErrorModal, {
          data: {
            title: 'Auth Error',
            error: authError,
            close: this.closeError,
          },
          disableClose: true,
          hasBackdrop: true,
          enterAnimationDuration: '0ms',
          exitAnimationDuration: '0ms',
        });
      }
    });

    this.destroyRef.onDestroy(() => {
      this.loadingDialogRef?.close();
      this.loadingDialogRef = null;

      this.errorDialogRef?.close();
      this.errorDialogRef = null;

      this.errorSource = null;
    });
  }
}
