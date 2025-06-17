import { NotificationDetailsDto, NotificationItemDto, NotificationTypeValue } from '@data-access';

import { ModuleBase } from '../_internal';

type BuildProps = Partial<{
  items: NotificationItemDto[];
  event_count?: number;
  notificationDetails?: NotificationDetailsDto;
}>;

export class NotificationDetailsModule extends ModuleBase<NotificationDetailsDto> {
  public buildDto(props?: BuildProps): NotificationDetailsDto {
    return (
      props?.notificationDetails ?? {
        id: this.faker.string.uuid(),
        type: NotificationTypeValue.ACCEPTANCE_REQUIRED,
        image_base_64: '',
        message: 'Hello world',
        details: 'Hello world',
        accepted_at: 0,
      }
    );
  }
}
