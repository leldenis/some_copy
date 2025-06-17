import { TicketStatus } from '@constant';

export interface TicketActivityLogItemDto {
  status: TicketStatus;
  actual_from: number;
  transferred_by_account_id: string;
  transferred_by_full_name: string;
  comment: string;
  clarification_details?: ActivityLogClarificationDetailsDto;
}

export interface ActivityLogClarificationDetailsDto {
  comment?: string;
}
