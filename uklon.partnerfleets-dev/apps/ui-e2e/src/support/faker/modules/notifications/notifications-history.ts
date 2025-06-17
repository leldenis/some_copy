import {
  CollectionCursorDto,
  NotificationDetailsDto,
  NotificationImportanceValue,
  NotificationItemDto,
  NotificationTypeValue,
} from '@data-access';

import { ModuleBase } from '../_internal';

type BuildProps = Partial<{
  items: NotificationItemDto[];
  event_count?: number;
  notificationDetails?: NotificationDetailsDto;
}>;

const EVENT_DEFAULT_COUNT = 10;
const BULKS = [
  NotificationTypeValue.ACCEPTANCE_REQUIRED,
  NotificationTypeValue.IMPORTANT_INFORMATION,
  NotificationTypeValue.FLEET_CABINET_UPDATE,
];

export class NotificationsHistoryModule extends ModuleBase<CollectionCursorDto<NotificationItemDto>> {
  public buildDto(props?: BuildProps): CollectionCursorDto<NotificationItemDto> {
    return {
      next_cursor: '5457',
      previous_cursor: '0',
      items:
        props?.items ??
        Array.from({ length: props?.event_count ?? EVENT_DEFAULT_COUNT }).map(this.buildEvent.bind(this)),
    };
  }

  private buildEvent(_, index: number): NotificationItemDto {
    return {
      id: this.faker.string.uuid(),
      importance: NotificationImportanceValue.NORMAL,
      type: index > 2 ? NotificationTypeValue.DRIVER_ADDED_TO_FLEET : BULKS[index],
      message: `Hello world ${index}`,
      sent_at: index === 0 ? 1_730_271_950 : 1_730_117_791,
      is_read: false,
      is_bulk: index <= 2,
      is_acceptance_required: index === 0,
      accepted_at: 0,
    };
  }
}
