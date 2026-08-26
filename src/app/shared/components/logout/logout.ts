import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

import { AuthActions } from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-logout',
  imports: [MatButtonModule],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Logout {
  private readonly store = inject(Store);

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
