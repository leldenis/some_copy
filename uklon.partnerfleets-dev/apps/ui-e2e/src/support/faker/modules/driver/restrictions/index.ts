import { DriverRestrictionDto, DriverRestrictionListDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: DriverRestrictionDto;
}>;

export class DriverRestrictionsModule extends ModuleBase<DriverRestrictionListDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverRestrictionListDto {
    return {
      items: Array.isArray(props?.items) ? props.items : [],
    };
  }
}
