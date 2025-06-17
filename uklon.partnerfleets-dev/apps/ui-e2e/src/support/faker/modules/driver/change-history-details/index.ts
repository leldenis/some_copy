import {
  DriverHistoryChange,
  DriverHistoryChangeItemDetailsDto,
  DriverHistoryChangeItemDto,
  HistoryInitiatorType,
} from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  change_type?: DriverHistoryChange;
  details: DriverHistoryChangeItemDetailsDto;
}>;

export class DriverChangeHistoryDetailsModule extends ModuleBase<DriverHistoryChangeItemDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverHistoryChangeItemDto {
    return {
      id: this.faker.string.uuid(),
      has_additional_data: true,
      change_type: props?.change_type ?? DriverHistoryChange.PROFILE_CHANGED,
      occurred_at: 1_727_691_852,
      linked_entities: {},
      initiator: {
        display_name: 'System',
        type: HistoryInitiatorType.SYSTEM,
        account_id: this.faker.string.uuid(),
      },
      details: props?.details,
    };
  }
}
