import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import * as authSelectors from '@ui/core/store/auth/auth.selectors';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements OnDestroy {
  private user: UserDto;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly authStore: Store<AuthState>,
    private readonly router: Router,
  ) {
    this.authStore
      .select(authSelectors.getUser)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserDto) => {
        this.user = user;
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public canActivate(): boolean {
    return this.hasAccess();
  }

  public canActivateChild(): boolean {
    return this.hasAccess();
  }

  public canLoad(): boolean {
    return this.hasAccess();
  }

  public hasAccess(): boolean {
    if (!this.isLoggedIn()) {
      this.navigateToLoginPage();
      return false;
    }

    return true;
  }

  private isLoggedIn(): boolean {
    return !!this.user?.accessToken;
  }

  private navigateToLoginPage(): void {
    this.router.navigateByUrl('/auth');
  }
}
