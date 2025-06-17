import { Restriction, RestrictionReason } from '@constant';
import { DriverRestrictionDto, DriverRestrictionListDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: DriverRestrictionDto;
}>;

export class DriverRestrictionsSettingsModule extends ModuleBase<DriverRestrictionListDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverRestrictionListDto {
    return {
      items: Array.isArray(props?.items)
        ? props.items
        : [
            {
              actual_from: 1_736_856_600,
              created_at: 1_736_856_610,
              actual_till: null,
              fleet_id: '78c6453a-e0f7-47a0-bff7-38ceb043b317',
              fleet_name: 'AQA',
              restricted_by: RestrictionReason.FLEET,
              type: Restriction.BROAD_CAST,
              created_by: {
                account_id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                display_name: 'AQA Test',
                roles: ['GlobalPartnerModerator'],
              },
              current_fleet_id: '',
              linked_entity: {
                id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                type: 'GlobalPartnerModerator',
              },
            },
            {
              actual_from: 1_736_856_600,
              created_at: 1_736_856_610,
              actual_till: null,
              fleet_id: '78c6453a-e0f7-47a0-bff7-38ceb043b317',
              fleet_name: 'AQA',
              restricted_by: RestrictionReason.FLEET,
              type: Restriction.FILTER_OFFER,
              created_by: {
                account_id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                display_name: 'AQA Test',
                roles: ['GlobalPartnerModerator'],
              },
              current_fleet_id: '',
              linked_entity: {
                id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                type: 'GlobalPartnerModerator',
              },
            },
            {
              actual_from: 1_736_856_600,
              created_at: 1_736_856_610,
              actual_till: null,
              fleet_id: '78c6453a-e0f7-47a0-bff7-38ceb043b317',
              fleet_name: 'AQA',
              restricted_by: RestrictionReason.MANAGER,
              type: Restriction.CASH,
              created_by: {
                account_id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                display_name: 'AQA Test',
                roles: ['GlobalPartnerModerator'],
              },
              current_fleet_id: '',
              linked_entity: {
                id: '932ec418-87f6-43d8-9c1a-869b567cb2e2',
                type: 'GlobalPartnerModerator',
              },
            },
          ],
    };
  }
}
