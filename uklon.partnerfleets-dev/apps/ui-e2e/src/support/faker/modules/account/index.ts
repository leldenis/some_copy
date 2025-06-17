import { BlockedListStatusValue } from '@constant';
import { AccountDto, FleetDto, FleetRole, FleetType, Locale } from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  last_name: string;
  first_name: string;
  phone: string;
  email: string;
  locale: Locale;
  mfa: boolean;
  fleets: FleetDto[];
  fleetsId: string[];
}>;

export class AccountModule extends ModuleBase<AccountDto, BuildProps> {
  public buildDto(props?: BuildProps): AccountDto {
    return {
      user_id: 'f6ab19f5-3f27-4128-8eff-95ef6cc096a1',
      last_name: props?.last_name ?? 'Aqa404',
      first_name: props?.first_name ?? 'Aqa404',
      phone: props?.phone ?? '380669243644',
      email: props?.email ?? 'aqa404@uklon.com',
      locale: props?.locale ?? Locale.UK,
      fleets: this.generateFleets(props?.fleets ?? props?.fleetsId),
      mfa_enabled: props?.mfa ?? false,
      status: {
        value: BlockedListStatusValue.ACTIVE,
      },
    };
  }

  private generateFleetFromId(fleetId: string): FleetDto {
    return {
      id: fleetId,
      name: `FLEET_${fleetId.slice(0, 8)}`,
      region_id: 26,
      email: `fleet_${fleetId.slice(0, 8)}@uklon.com`,
      role: FleetRole.OWNER,
      fleet_type: FleetType.COMMERCIAL,
      tin_refused: false,
      is_fiscalization_enabled: true,
    };
  }

  private generateFleets(input?: FleetDto[] | string[]): FleetDto[] {
    // Case 1: No input - return default fleet
    if (!input) {
      return [
        {
          id: '829492c9-29d5-41df-8e9b-14a407235ce1',
          name: 'AQA404TESTFLEET',
          region_id: 26,
          email: 'aqa404fleet@uklon.com',
          role: FleetRole.OWNER,
          fleet_type: FleetType.COMMERCIAL,
          tin_refused: false,
          is_fiscalization_enabled: true,
        },
      ];
    }

    // Case 2: Input is FleetDto[] - return as is
    if (input.length > 0 && typeof input[0] === 'object') {
      return input as FleetDto[];
    }

    // Case 3: Input is FleetId[] - generate fleets from IDs
    return (input as string[]).map((id) => this.generateFleetFromId(id));
  }
}
