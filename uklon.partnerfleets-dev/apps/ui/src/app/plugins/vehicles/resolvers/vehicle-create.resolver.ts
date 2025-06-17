import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { FleetDetailsDto, FleetDto, IdentityDto } from '@data-access';
import { Store } from '@ngrx/store';
import { FleetService } from '@ui/core';
import { AuthService } from '@ui/core/services/auth.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { fleetIdKey, StorageService } from '@ui/core/services/storage.service';
import { accountActions } from '@ui/core/store/account/account.actions';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { EMPTY, finalize, Observable, switchMap } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface ResolveData {
  token: IdentityDto;
  fleetId: string;
}

@Injectable()
export class VehicleCreateResolver {
  constructor(
    private readonly router: Router,
    private readonly store: Store<AuthState>,
    private readonly authService: AuthService,
    private readonly storage: StorageService,
    private readonly fleetService: FleetService,
    private readonly loaderService: LoadingIndicatorService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<ResolveData> | Promise<ResolveData> | ResolveData {
    this.loaderService.show();
    const tokenParam = route.queryParamMap.get('token');
    const fleetIdParam = route.queryParamMap.get('fleet_id');

    if (!tokenParam || !fleetIdParam) {
      this.loaderService.hide();
      return this.fail('empty_token_or_fleet');
    }

    return this.authService.refreshAuthToken(tokenParam, true).pipe(
      map((identityData) => ({ token: identityData, fleetId: fleetIdParam })),
      catchError(() => this.fail('retrieving_token_failed')),
      tap((resolveData: ResolveData) => this.store.dispatch(authActions.loginSuccess(resolveData.token))),
      switchMap((resolveData: ResolveData) => this.getFleet(fleetIdParam).pipe(map(() => resolveData))),
      finalize(() => this.loaderService.hide()),
    );
  }

  private fail(error: string): Observable<never> {
    this.router.navigate(['/auth/login'], { queryParams: { source: 'plugin:vehicles.create', error } });

    return EMPTY;
  }

  private getFleet(fleetId: string): Observable<FleetDetailsDto> {
    this.storage.set(fleetIdKey, fleetId);

    return this.fleetService.getFleetById(fleetId).pipe(
      tap((fleet) => {
        this.store.dispatch(accountActions.setSelectedFleet(fleet as unknown as FleetDto));
      }),
      map((fleet) => fleet),
    );
  }
}
