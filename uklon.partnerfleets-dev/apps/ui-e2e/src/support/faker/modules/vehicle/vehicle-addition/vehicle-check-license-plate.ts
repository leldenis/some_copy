import { TicketStatus, TicketType } from '@constant';
import { PaginationCollectionDto, VehicleTicketDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items: VehicleTicketDto[];
  licensePlate: string;
}>;

const DEFAULT_COUNT = 1;

export class VehicleCheckLicensePlateModule extends ModuleBase<PaginationCollectionDto<VehicleTicketDto>, BuildProps> {
  public buildDto(props?: BuildProps): PaginationCollectionDto<VehicleTicketDto> {
    return {
      total_count: props?.items?.length ?? DEFAULT_COUNT,
      items: props?.items ?? Array.from({ length: props?.items?.length ?? DEFAULT_COUNT }).map((_) => this.buildItem()),
    };
  }

  private buildItem(props?: BuildProps): VehicleTicketDto {
    return {
      created_at: 1_727_691_852,
      id: this.faker.string.uuid(),
      license_plate: props?.licensePlate ?? this.faker.string.alphanumeric({ casing: 'upper' }),
      status: TicketStatus.DRAFT,
      type: TicketType.VEHICLE_TO_FLEET_ADDITION,
      model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
      model: 'Audi',
      make: 'A8',
      make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
      production_year: 2024,
    };
  }
}
