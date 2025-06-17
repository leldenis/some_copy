import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { IdentityDto, Language, VehiclePhotoControlTicketDto } from '@data-access';
import { Store } from '@ngrx/store';
import { AppTranslateService } from '@ui/core/services/app-translate.service';
import { AuthService } from '@ui/core/services/auth.service';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { authActions } from '@ui/core/store/auth/auth.actions';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { EMPTY, finalize, Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

export interface ResolveData {
  token: IdentityDto;
  ticketId: string;
}

@Injectable()
export class VehiclePhotoControlFormResolver {
  private readonly ticketService = inject(TicketsService);

  constructor(
    private readonly router: Router,
    private readonly authStore: Store<AuthState>,
    private readonly authService: AuthService,
    private readonly vehiclesService: VehiclesService,
    private readonly appTranslateService: AppTranslateService,
    private readonly loaderService: LoadingIndicatorService,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<VehiclePhotoControlTicketDto> {
    this.loaderService.show();
    const token = route.queryParamMap.get('token');
    const ticketId = route.queryParamMap.get('ticket_id');
    const language = route.queryParamMap.get('language');

    this.changeLanguage(language);

    if (!token || !ticketId) {
      this.loaderService.hide();
      return this.fail('empty_token_or_ticket_id');
    }

    return this.authService.refreshAuthToken(token, true).pipe(
      map((identityData) => ({ token: identityData, ticketId })),
      catchError(() => this.fail('retrieving_token_failed')),
      tap((resolveData: ResolveData) => this.authStore.dispatch(authActions.loginSuccess(resolveData.token))),
      switchMap(() => this.ticketService.getFleetVehiclePhotoControlTicket(ticketId)),
      switchMap((ticket) =>
        this.vehiclesService
          .getLicensePlateById(ticket.vehicle_id)
          .pipe(map(({ license_plate }) => ({ ...ticket, license_plate }))),
      ),
      finalize(() => this.loaderService.hide()),
    );
  }

  private fail(error: string): Observable<never> {
    this.router.navigate(['/auth/login'], { queryParams: { source: 'plugin:vehicles.photo-control', error } });

    return EMPTY;
  }

  private changeLanguage(language: string): void {
    if (!language) return;

    this.appTranslateService.changeLanguage(
      this.appTranslateService.isLanguageValid(language) ? language : Language.EN,
      'params',
    );
  }
}
