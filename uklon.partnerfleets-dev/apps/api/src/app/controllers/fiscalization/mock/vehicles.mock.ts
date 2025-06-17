import { BlockedListStatusValue, BodyType, FleetVehicleComfortLevel, LoadCapacity } from '@constant';
import {
  FleetVehicleDto,
  FleetVehicleCollectionDto,
  FleetVehicleColor,
  FleetVehicleDriverType,
  FleetVehicleFuel,
  FleetVehicleOption,
} from '@data-access';

const VEHICLE_MOCK = {
  about: {
    bodyType: BodyType.MINIVAN,
    color: FleetVehicleColor.RED,
    maker: {
      id: '14917bce-2af7-41c3-83f8-7b01cfb2f57a',
      name: 'Autobianchi',
    },
    model: {
      id: 'cfa281ef-a005-4e0b-bdf9-94be854eee4b',
      name: 'A 112',
    },
    options: [FleetVehicleOption.AIR_CONDITIONER],
    productionYear: 2019,
    seats: 4,
    fuels: [FleetVehicleFuel.GASOLINE],
    loadCapacity: LoadCapacity.MEDIUM,
  },
  driver: {
    id: 'a52dca78-412e-48da-a540-84d3a053594e',
    fullName: 'Test Driver-In-Park',
  },
  status: {
    value: BlockedListStatusValue.ACTIVE,
  },
  uklon: {
    accessibleFor: FleetVehicleDriverType.SPECIFIC_DRIVERS,
    addedAt: 1_676_375_405,
    comfortLevel: FleetVehicleComfortLevel.BUSINESS,
    hasBranding: false,
    hasPriority: false,
  },
};

export const VEHICLE_1_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR1338',
  id: '9d73e1d0-f537-4073-a960-3a86e7c4493f',
};

export const VEHICLE_2_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR7801',
  id: 'd3fd4dfa-b891-46b0-bb40-5f74e269525c',
};

export const VEHICLE_3_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR7334',
  id: 'cb0cdd39-9a4c-4fef-94d7-9dfee3baa934',
};

export const VEHICLE_4_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR5535',
  id: 'b7f419ce-2f8c-4b40-be21-593766f807df',
};

export const VEHICLE_5_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR1622',
  id: '54216ef5-b728-41be-8461-238a4ccc8753',
};

export const VEHICLE_6_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR4311',
  id: '98ff5d8c-610b-4ea3-b550-e049f1712687',
};

export const VEHICLE_7_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR9268',
  id: 'c5d6c463-f1f5-4f72-8a46-0b69c0d71313',
};

export const VEHICLE_8_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR2298',
  id: 'ea44601b-147c-497b-8f2c-aa2b461ed9d5',
};

export const VEHICLE_9_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'CAR7727',
  id: '64c66f2b-d865-4380-ad56-439c4e839c1b',
};

export const VEHICLE_10_MOCK: FleetVehicleDto = {
  ...VEHICLE_MOCK,
  licencePlate: 'LKSD23',
  id: 'ae23e0d7-9dc3-4516-a2c5-aecdd3415d87',
};

export const VEHICLE_COLLECTION_MOCK: FleetVehicleCollectionDto = {
  data: [
    VEHICLE_1_MOCK,
    VEHICLE_2_MOCK,
    VEHICLE_3_MOCK,
    VEHICLE_4_MOCK,
    VEHICLE_5_MOCK,
    VEHICLE_6_MOCK,
    VEHICLE_7_MOCK,
    VEHICLE_8_MOCK,
    VEHICLE_9_MOCK,
    VEHICLE_10_MOCK,
  ],
  total: 10,
};
