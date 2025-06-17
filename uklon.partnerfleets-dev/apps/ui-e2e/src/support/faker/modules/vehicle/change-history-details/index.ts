import { HistoryInitiatorType, VehicleHistoryChangeItemDto, VehicleHistoryType } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  change_type?: VehicleHistoryType;
  details?: Record<string, unknown>;
}>;

export class VehicleChangeHistoryDetailsModule extends ModuleBase<VehicleHistoryChangeItemDto, BuildProps> {
  public buildDto(props?: BuildProps): VehicleHistoryChangeItemDto {
    return {
      id: this.faker.string.uuid(),
      has_additional_data: true,
      change_type: props?.change_type ?? VehicleHistoryType.PROFILE_CHANGED,
      occurred_at: 1_727_691_852,
      linked_entities: {},
      initiator: {
        display_name: 'System',
        type: HistoryInitiatorType.SYSTEM,
        account_id: this.faker.string.uuid(),
      },
      details: props?.details ?? {},
    };
  }
}
