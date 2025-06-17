import { OrderStatus, TicketStatus } from '@constant';

import { StatusColor } from '../components';

export const VEHICLE_TICKET_STATUS_COLOR: Record<string, StatusColor> = {
  [TicketStatus.SENT]: 'success',
  [TicketStatus.DRAFT]: 'neutral',
  [TicketStatus.REVIEW]: 'accent',
  [TicketStatus.BLOCKED_BY_MANAGER]: 'accent',
  [TicketStatus.CLARIFICATION]: 'warn',
  [TicketStatus.REJECTED]: 'error',
} as const;

export const PHOTO_CONTROL_TICKET_STATUS_COLOR: Record<string, StatusColor> = {
  [TicketStatus.DRAFT]: 'warn',
  [TicketStatus.CLARIFICATION]: 'warn',
  [TicketStatus.REVIEW]: 'accent',
  [TicketStatus.BLOCKED_BY_MANAGER]: 'accent',
  [TicketStatus.SENT]: 'accent',
  [TicketStatus.APPROVED]: 'success',
  [TicketStatus.REJECTED]: 'error',
} as const;

export const ORDER_STATUS_COLOR: Record<string, StatusColor> = {
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.CANCELED]: 'error',
  [OrderStatus.RUNNING]: 'accent',
  [OrderStatus.ALL]: 'neutral',
  [OrderStatus.ACCEPTED]: 'success',
  [OrderStatus.ARRIVED]: 'accent',
} as const;
