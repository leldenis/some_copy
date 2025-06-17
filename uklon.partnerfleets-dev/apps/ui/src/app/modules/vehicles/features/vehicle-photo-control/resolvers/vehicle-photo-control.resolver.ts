import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { VehicleOptionDictionaryItemDto, VehiclePhotoControlTicketDto } from '@data-access';
import { Store } from '@ngrx/store';
import { ReferencesService } from '@ui/core/services/references.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { filter, forkJoin, map, Observable, switchMap } from 'rxjs';
import { first } from 'rxjs/operators';

export const vehiclePhotoControlResolver: ResolveFn<{
  ticket: VehiclePhotoControlTicketDto;
  options: VehicleOptionDictionaryItemDto[];
}> = (route: ActivatedRouteSnapshot) => {
  const ticketId = route.parent.paramMap.get('ticketId');
  const ticketsService = inject(TicketsService);
  const vehiclesService = inject(VehiclesService);
  const referencesService = inject(ReferencesService);
  const store = inject(Store<AccountState>);

  const ticketWithLicensePlate = (ticket: VehiclePhotoControlTicketDto): Observable<VehiclePhotoControlTicketDto> => {
    return vehiclesService
      .getLicensePlateById(ticket.vehicle_id)
      .pipe(map(({ license_plate }) => ({ ...ticket, license_plate })));
  };
  const vehicleOptions = ({
    region_id,
  }: VehiclePhotoControlTicketDto): Observable<VehicleOptionDictionaryItemDto[]> => {
    return referencesService.getOptionsByRegion(region_id).pipe(map(({ items }) => items));
  };

  const response$ = store.select(getSelectedFleet).pipe(
    filter(Boolean),
    first(),
    switchMap(() =>
      ticketsService
        .getFleetVehiclePhotoControlTicket(ticketId)
        .pipe(switchMap((ticket) => forkJoin([ticketWithLicensePlate(ticket), vehicleOptions(ticket)]))),
    ),
  );

  return response$.pipe(map(([ticket, options]) => ({ ticket, options })));
};
