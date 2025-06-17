import { TicketType } from '@constant';

export const TICKET_TYPE_TO_URL = {
  [TicketType.VEHICLE_PHOTO_CONTROL]: 'vehicle-photo-control',
  [TicketType.DRIVER_PHOTO_CONTROL]: 'driver-photo-control',
  [TicketType.VEHICLE_TO_FLEET_ADDITION]: 'vehicle-additions',
  [TicketType.VEHICLE_BRANDING_PERIOD]: 'vehicle-brandings',
};
