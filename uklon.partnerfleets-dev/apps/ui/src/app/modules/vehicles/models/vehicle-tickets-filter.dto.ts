import { TicketStatus } from '@constant';

export interface VehicleTicketsFilterDto {
  license_plate: string;
  status: TicketStatus | '';
}
