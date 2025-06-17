import { CollectionCursorDto, FleetHistoryChangeItemDto, FleetHistoryType, HistoryInitiatorType } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  next_cursor: string;
  items?: FleetHistoryChangeItemDto[];
}>;

const DEFAULT_COUNT = 10;

export class FleetHistoryModule extends ModuleBase<CollectionCursorDto<FleetHistoryChangeItemDto>> {
  public buildDto(props?: BuildProps): CollectionCursorDto<FleetHistoryChangeItemDto> {
    return {
      next_cursor: props?.next_cursor ?? '19231',
      previous_cursor: '0',
      items:
        props?.items ??
        Array.from({ length: props?.items.length ?? DEFAULT_COUNT }).map((_, index) =>
          this.buildHistoryEvent.bind(index, this),
        ),
    };
  }

  private buildHistoryEvent(): FleetHistoryChangeItemDto {
    return {
      id: this.faker.string.uuid(),
      change_type: FleetHistoryType.FISCALIZATION_POS_UNBINDED,
      occurred_at: 1_721_725_314,
      initiator: {
        display_name: 'System',
        type: HistoryInitiatorType.SYSTEM,
        account_id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
      },
      has_additional_data: true,
    };
  }
}
