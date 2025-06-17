import { FISCALIZATION_VEHICLES_COLLECTION_MOCK } from '@api/controllers/fiscalization/mock/fiscalization-vehicles.mock';
import { FleetVehicleFiscalizationCollectionDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = FleetVehicleFiscalizationCollectionDto;

export class FleetFiscalizationVehiclesModule extends ModuleBase<FleetVehicleFiscalizationCollectionDto> {
  public buildDto(props?: BuildProps): FleetVehicleFiscalizationCollectionDto {
    return props ?? FISCALIZATION_VEHICLES_COLLECTION_MOCK;
  }
}
