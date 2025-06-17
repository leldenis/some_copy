import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { IdentityDto } from '@data-access';
import { Store } from '@ngrx/store';
import { AuthService } from '@ui/core/services/auth.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { EMPTY, finalize, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ResolveData {
  token: IdentityDto;
  ticketId: string;
}

@Injectable()
export class VehicleTicketResolver {
  constructor(
    private readonly router: Router,
    private readonly authStore: Store<AuthState>,
    private readonly authService: AuthService,
    private readonly loaderService: LoadingIndicatorService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ResolveData> | Promise<ResolveData> | ResolveData {
    this.loaderService.show();
    const tokenParam = route.queryParamMap.get('token');
    const ticketIdParam = route.queryParamMap.get('ticket_id');

    if (!tokenParam || !ticketIdParam) {
      this.loaderService.hide();
      return this.fail('empty_token_or_ticket_id');
    }

    return this.authService.refreshAuthToken(tokenParam, true).pipe(
      map((identityData) => ({ token: identityData, ticketId: ticketIdParam })),
      catchError(() => this.fail('retrieving_token_failed')),
      tap((resolveData: ResolveData) => this.authStore.dispatch(authActions.loginSuccess(resolveData.token))),
      finalize(() => this.loaderService.hide()),
    );
  }

  private fail(error: string): Observable<never> {
    this.router.navigate(['/auth/login'], { queryParams: { source: 'plugin:vehicles.ticket', error } });

    return EMPTY;
  }
}
