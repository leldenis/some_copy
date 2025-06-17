import { TicketStatus } from '@constant';

import { VehiclePhotoControlCreatingReasonsDto } from '../tickets/vehicle-photo-control-creation-reason.dto';

export interface VehicleDetailsPhotoControlDto extends VehiclePhotoControlCreatingReasonsDto {
  ticket_id: string;
  deadline_to_send: number;
  status?: TicketStatus;
  block_immediately?: boolean;
}
