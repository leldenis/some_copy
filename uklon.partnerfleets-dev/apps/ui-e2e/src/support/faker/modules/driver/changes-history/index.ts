import {
  DriverHistoryChange,
  DriverHistoryChangeItemDto,
  DriverHistoryChangesDto,
  HistoryInitiatorType,
} from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: DriverHistoryChangeItemDto[];
  count_items?: number;
}>;

const DEFAULT_COUNT = 10;

export class DriverChangeHistoryModule extends ModuleBase<DriverHistoryChangesDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverHistoryChangesDto {
    return {
      next_cursor: '15228',
      previous_cursor: '0',
      items: props.items ?? Array.from({ length: props?.count_items ?? DEFAULT_COUNT }, (_) => this.buildEvent()),
    };
  }

  private buildEvent(): DriverHistoryChangeItemDto {
    return {
      id: this.faker.string.uuid(),
      has_additional_data: true,
      change_type: DriverHistoryChange.PRODUCT_AVAILABILITY_CHANGED,
      occurred_at: 1_727_691_852,
      linked_entities: {},
      initiator: {
        display_name: 'System',
        type: HistoryInitiatorType.SYSTEM,
        account_id: this.faker.string.uuid(),
      },
    };
  }
}
