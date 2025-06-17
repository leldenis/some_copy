import {
  HistoryInitiatorType,
  VehicleHistoryChangeItemDto,
  VehicleHistoryChangesDto,
  VehicleHistoryType,
} from '@data-access';

import { ModuleBase } from '../../_internal';

const EVENT_DEFAULT_COUNT = 5;

export type BuildProps = Partial<{
  items: VehicleHistoryChangeItemDto[];
  event_count?: number;
}>;

export class VehicleHistoryModule extends ModuleBase<VehicleHistoryChangesDto> {
  public buildDto(props?: BuildProps): VehicleHistoryChangesDto {
    return {
      next_cursor: '5457',
      previous_cursor: '0',
      items:
        props.items ??
        Array.from({ length: props?.event_count ?? EVENT_DEFAULT_COUNT }).map((_, index) =>
          this.buildEvent.bind(index, this),
        ),
    };
  }

  private buildEvent(): VehicleHistoryChangeItemDto {
    return {
      id: this.faker.string.uuid(),
      change_type: VehicleHistoryType.PRODUCT_AVAILABILITY_CHANGED,
      occurred_at: 1_725_884_015,
      initiator: {
        display_name: 'System',
        type: HistoryInitiatorType.SYSTEM,
        account_id: '',
      },
      linked_entities: {},
      has_additional_data: true,
    };
  }
}
