import { FleetFiscalizationStatusDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  status: boolean;
}>;

export class FleetFiscalizationStatusModule extends ModuleBase<FleetFiscalizationStatusDto> {
  public buildDto(props?: BuildProps): FleetFiscalizationStatusDto {
    return {
      status: props?.status ?? true,
    };
  }
}
