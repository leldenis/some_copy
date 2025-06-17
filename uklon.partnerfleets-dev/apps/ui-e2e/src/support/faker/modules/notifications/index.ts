import { NotificationDetailsDto, NotificationItemDto } from '@data-access';

export type BuildProps = Partial<{
  items: NotificationItemDto[];
  event_count?: number;
  notificationDetails?: NotificationDetailsDto;
}>;

export * from './notifications-history';
export * from './top-unread-notificaitions';
export * from './notification-details';
