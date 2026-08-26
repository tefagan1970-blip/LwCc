import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';

import { AuthActions } from '../../core/store/auth/auth.actions';
import { authFeature } from '../../core/store/auth/auth.reducer';
import { PageWrapper } from '../../shared/components/page-wrapper/page-wrapper';

@Component({
  selector: 'app-login-page',
  imports: [PageWrapper, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly store = inject(Store);
  readonly username = this.store.selectSignal(authFeature.selectUsername);
  readonly loggingIn = this.store.selectSignal(authFeature.selectLoggingIn);
  readonly error = this.store.selectSignal(authFeature.selectError);

  readonly loginForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  logIn(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    if (this.loggingIn()) {
      return;
    }

    const username = this.loginForm.controls.username.value.trim();

    if (!username) {
      this.loginForm.controls.username.setErrors({
        required: true,
      });

      this.loginForm.controls.username.markAsTouched();

      return;
    }

    this.store.dispatch(
      AuthActions.loginRequested({
        username,
      }),
    );
  }
}
