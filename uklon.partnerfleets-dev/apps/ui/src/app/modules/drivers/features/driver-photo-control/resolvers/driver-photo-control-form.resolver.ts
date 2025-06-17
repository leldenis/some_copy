import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TicketStatus } from '@constant';
import { DriverPhotoControlTicketDto, FleetDriverDto } from '@data-access';
import { DriverService } from '@ui/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { fleetIdKey, StorageService } from '@ui/core/services/storage.service';
import { DriverPhotoControlService } from '@ui/modules/drivers/services/driver-photo-control.service';
import { EMPTY, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

export const driverPhotoControlFormResolver: ResolveFn<{
  ticket: DriverPhotoControlTicketDto;
  driver: FleetDriverDto;
}> = (route) => {
  const photoControlService = inject(DriverPhotoControlService);
  const driversService = inject(DriverService);
  const storageService = inject(StorageService);
  const router = inject(Router);

  const { ticketId } = route.params;
  const fleetId = storageService.get(fleetIdKey);

  return photoControlService.getDriverPhotoControlTicket(ticketId).pipe(
    switchMap((ticket) => {
      if (ticket.status !== TicketStatus.DRAFT && ticket.status !== TicketStatus.CLARIFICATION) {
        router.navigate(['/', CorePaths.WORKSPACE, CorePaths.DRIVERS], { fragment: 'photo-control' });
        return EMPTY;
      }

      return driversService.getFleetDriverById(fleetId, ticket.driver_id).pipe(
        map((driver) => ({
          driver,
          ticket,
        })),
      );
    }),
  );
};
