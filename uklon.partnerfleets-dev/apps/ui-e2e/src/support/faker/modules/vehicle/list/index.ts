import { BlockedListStatusValue, BodyType, FleetVehicleComfortLevel, LoadCapacity, TicketStatus } from '@constant';
import {
  FleetVehicleDto,
  FleetVehicleCollectionDto,
  FleetVehicleColor,
  FleetVehicleDriverType,
  FleetVehicleFuel,
  VehicleBrandingPeriodDto,
} from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  count: number;
  total?: number;
  branding_period?: VehicleBrandingPeriodDto;
  vehicle_list?: FleetVehicleDto[];
}>;

const DEFAULT_COUNT = 10;

export class FleetVehiclesListModule extends ModuleBase<FleetVehicleCollectionDto, BuildProps> {
  public buildDto(props?: BuildProps): FleetVehicleCollectionDto {
    return {
      total: props?.total ?? DEFAULT_COUNT,
      data: props?.vehicle_list?.length
        ? props.vehicle_list.map((vehicle, _index) => this.buildVehicle(vehicle, props))
        : Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(() => this.buildVehicle(undefined, props)),
    };
  }

  private buildVehicle(vehicleFromList?: FleetVehicleDto, props?: BuildProps): FleetVehicleDto {
    return {
      id: vehicleFromList?.id ?? this.faker.string.uuid(),
      licencePlate: vehicleFromList?.licencePlate ?? 'AQA7297',
      status: vehicleFromList?.status ?? { value: BlockedListStatusValue.ACTIVE },
      about: vehicleFromList?.about ?? {
        color: FleetVehicleColor.WHITE,
        bodyType: BodyType.COUPE,
        maker: { name: 'Cadillac', id: '3327da7b-5a97-4ec0-b84b-6fce2e5335b5' },
        model: { name: 'XTS', id: '0de49c67-8119-4183-86f1-e6a32759fe0a' },
        productionYear: 2017,
        seats: 4,
        fuels: [FleetVehicleFuel.GAS],
        options: [],
        loadCapacity: LoadCapacity.MEDIUM,
      },
      uklon: vehicleFromList?.uklon ?? {
        hasBranding: false,
        hasPriority: false,
        addedAt: 1_668_675_444,
        comfortLevel: FleetVehicleComfortLevel.ECONOM,
        accessibleFor: FleetVehicleDriverType.SPECIFIC_DRIVERS,
      },
      driver: vehicleFromList?.driver ?? null,
      branding_period: props?.branding_period ?? {
        ticket_id: this.faker.string.uuid(),
        status: TicketStatus.DRAFT,
        deadline_to_send: 1_735_275_689,
      },
    };
  }
}
