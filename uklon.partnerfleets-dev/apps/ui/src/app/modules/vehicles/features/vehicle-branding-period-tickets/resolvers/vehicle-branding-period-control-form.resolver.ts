import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VehicleBasicInfoDto, VehicleBrandingPeriodTicketDto } from '@data-access';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { forkJoin, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const vehicleBrandingPeriodControlFormResolver: ResolveFn<
  | {
      vehicle: VehicleBasicInfoDto;
      ticket: VehicleBrandingPeriodTicketDto;
    }
  | false
> = (route) => {
  const vehiclesService = inject(VehiclesService);
  const ticketsService = inject(TicketsService);

  const { vehicleId, ticketId } = route.params;

  if (!vehicleId || !ticketId) {
    return false;
  }

  return forkJoin([
    vehiclesService.getLicensePlateById(vehicleId),
    ticketsService.getVehicleBrandingPeriodTicket(ticketId),
  ]).pipe(
    map(([vehicle, ticket]) => ({ vehicle, ticket })),
    catchError((error) => {
      return throwError(() => error);
    }),
  );
};
