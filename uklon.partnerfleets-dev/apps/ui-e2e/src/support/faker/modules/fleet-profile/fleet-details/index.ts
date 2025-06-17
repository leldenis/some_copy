import { BlockedListStatusValue } from '@constant';
import { FleetContactDto, FleetDetailsDto, FleetMaintainerDto, FleetRole, FleetStatus, FleetType } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  is_fiscalization_enabled: boolean;
  maintainer?: FleetMaintainerDto;
  reserve_maintainer?: FleetMaintainerDto;
  users?: FleetContactDto[];
}>;

export class FleetDetailsModule extends ModuleBase<FleetDetailsDto> {
  public buildDto(props?: BuildProps): FleetDetailsDto {
    return {
      users: props?.users ?? [
        {
          email: 'aqa404@uklon.com',
          first_name: 'Aqa404',
          last_name: 'Aqa404',
          mfa_enabled: false,
          phone: '380669243644',
          role: FleetRole.OWNER,
          status: {
            value: BlockedListStatusValue.ACTIVE,
          },
          user_id: 'f6ab19f5-3f27-4128-8eff-95ef6cc096a1',
        },
      ],
      wallet_id: '75d99e5a-812e-44f4-9f78-1492f6ea5347',
      id: '829492c9-29d5-41df-8e9b-14a407235ce1',
      region_id: 1,
      name: 'AQA404TESTFLEET',
      created_at: 1_666_355_120,
      email: 'aqa404fleet@uklon.com',
      driver_count: 49,
      employee_count: 49,
      vehicle_count: 1,
      status: FleetStatus.ACTIVE,
      type: FleetType.COMMERCIAL,
      is_fiscalization_enabled: props?.is_fiscalization_enabled ?? false,
      maintainer: props?.maintainer ?? null,
      reserve_maintainer: props?.reserve_maintainer ?? null,
    };
  }
}
