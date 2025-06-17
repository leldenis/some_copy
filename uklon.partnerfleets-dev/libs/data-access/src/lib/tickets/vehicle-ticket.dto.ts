import { TicketStatus, TicketType } from '@constant';

export interface VehicleTicketDto {
  model_id: string;
  model: string;
  make_id: string;
  make: string;
  production_year: number;
  license_plate: string;
  id: string;
  type: TicketType;
  status: TicketStatus;
  created_at: number;
}
