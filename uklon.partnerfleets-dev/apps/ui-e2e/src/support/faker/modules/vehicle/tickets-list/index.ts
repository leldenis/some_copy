import { TicketStatus, TicketType } from '@constant';
import { PaginationCollectionDto, VehicleTicketDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: VehicleTicketDto[];
}>;

const DEFAULT_COUNT = 10;

export class FleetVehiclesTicketsListModule extends ModuleBase<PaginationCollectionDto<VehicleTicketDto>> {
  public buildDto(props?: BuildProps): PaginationCollectionDto<VehicleTicketDto> {
    return {
      total_count: props.items.length ?? DEFAULT_COUNT,
      items:
        props.items ??
        Array.from({ length: props?.items.length ?? DEFAULT_COUNT }).map((_, index) =>
          this.buildVehicleTicket.bind(index, this),
        ),
    };
  }

  private buildVehicleTicket(): VehicleTicketDto {
    return {
      created_at: 1_727_691_852,
      id: this.faker.string.uuid(),
      license_plate: this.faker.string.alphanumeric({ casing: 'upper' }),
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
