import {
  NotificationDetailsDto,
  NotificationImportanceValue,
  NotificationItemDto,
  NotificationTypeValue,
  PaginationCollectionDto,
} from '@data-access';

import { ModuleBase } from '../_internal';

type BuildProps = Partial<{
  items: NotificationItemDto[];
  event_count?: number;
  notificationDetails?: NotificationDetailsDto;
}>;

const EVENT_DEFAULT_COUNT = 3;
const BULKS = [
  NotificationTypeValue.ACCEPTANCE_REQUIRED,
  NotificationTypeValue.IMPORTANT_INFORMATION,
  NotificationTypeValue.FLEET_CABINET_UPDATE,
];

export class TopUnreadNotificationsModule extends ModuleBase<PaginationCollectionDto<NotificationItemDto>> {
  public buildDto(props?: BuildProps): PaginationCollectionDto<NotificationItemDto> {
    return {
      total_count: props?.event_count ?? EVENT_DEFAULT_COUNT,
      items:
        props?.items ??
        Array.from({ length: props?.event_count ?? EVENT_DEFAULT_COUNT }).map(this.buildEvent.bind(this)),
    };
  }

  private buildEvent(_, idx: number): NotificationItemDto {
    const type = BULKS[idx];

    return {
      id: this.faker.string.uuid(),
      importance: NotificationImportanceValue.NORMAL,
      type,
      message: `Hello world ${idx}`,
      sent_at: 1_730_117_791,
      is_read: false,
      is_bulk: true,
      is_acceptance_required: type === BULKS[0],
      accepted_at: 0,
    };
  }
}
