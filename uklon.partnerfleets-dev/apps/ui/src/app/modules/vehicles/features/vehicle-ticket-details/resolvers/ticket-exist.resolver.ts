import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AddVehicleTicketDto, VehicleTicketConfigDto } from '@data-access';
import { Store } from '@ngrx/store';
import { LoadingIndicatorService } from '@ui/core/services/loading-indicator.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesState } from '@ui/modules/vehicles/store';
import { finalize, forkJoin, Observable, tap } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

interface ResolveTicketData {
  config: VehicleTicketConfigDto;
  ticket: AddVehicleTicketDto;
  fleetId: string;
}

export const ticketExistResolver: ResolveFn<Observable<ResolveTicketData>> = (route) => {
  const store = inject(Store<VehiclesState>);
  const ticketsService = inject(TicketsService);
  const loadingIndicatorService = inject(LoadingIndicatorService);

  const { ticketId } = route.params;

  return store.select(getSelectedFleet).pipe(
    filter(Boolean),
    tap(() => loadingIndicatorService.show()),
    mergeMap((fleet) => {
      const ticket$ = ticketsService.getFleetVehiclesCreationTicket(ticketId);
      const config$ = ticketsService.getTicketConfigByRegionId(fleet.region_id);

      return forkJoin([ticket$, config$]).pipe(map(([ticket, config]) => ({ ticket, config, fleetId: fleet.id })));
    }),
    finalize(() => loadingIndicatorService.hide()),
  );
};
