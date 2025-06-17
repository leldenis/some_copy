import { TicketStatus } from '@constant';

export interface VehicleBrandingPeriodTicketItemDto {
  id: string;
  status: TicketStatus;
  created_at: number;
  vehicle_id: string;
  deadline_to_send?: number;
  monthly_code?: string;
  model_id?: string;
  model?: string;
  make_id?: string;
  make?: string;
  production_year?: number;
  license_plate?: string;
  color: string;
  reject_or_clarification_reason?: string;
}
