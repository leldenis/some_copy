import { FleetHistoryChangeItemDto, FleetHistoryType, HistoryInitiatorType } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  item?: FleetHistoryChangeItemDto;
}>;

export class FleetHistoryDetailModule extends ModuleBase<FleetHistoryChangeItemDto> {
  public buildDto(props?: BuildProps): FleetHistoryChangeItemDto {
    return (
      props?.item ?? {
        id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
        change_type: FleetHistoryType.DRIVER_REMOVED,
        occurred_at: 1_721_725_400,
        initiator: {
          display_name: 'System',
          type: HistoryInitiatorType.SYSTEM,
          account_id: '5e2e26e5-30a9-45b7-9521-3112e5c21970',
        },
        has_additional_data: true,
        details: {
          driver: {
            disability_type: 'Nothing',
            driver_id: '04344465-24c9-46d7-b250-b4918212ab08',
          },
        },
      }
    );
  }
}
