import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleTicketConfigDto } from '@data-access';
import { Store } from '@ngrx/store';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { selectedFleetRegionId } from '@ui/core/store/account/account.selectors';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesState } from '@ui/modules/vehicles/store';
import { finalize, Observable, tap } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

export const ticketConfigByRegionResolver: ResolveFn<Observable<VehicleTicketConfigDto>> = () => {
  const store = inject(Store<VehiclesState>);
  const ticketsService = inject(TicketsService);
  const loadingIndicatorService = inject(LoadingIndicatorService);

  return store.select(selectedFleetRegionId).pipe(
    filter(Boolean),
    tap(() => loadingIndicatorService.show()),
    mergeMap((regionId) =>
      ticketsService.getTicketConfigByRegionId(regionId).pipe(finalize(() => loadingIndicatorService.hide())),
    ),
  );
};
