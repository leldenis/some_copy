import { TicketStatus } from '@constant';

export interface VehicleBrandingPeriodDto {
  ticket_id: string;
  deadline_to_send?: number;
  status: TicketStatus;
  reject_or_clarification_reason?: string;
}
