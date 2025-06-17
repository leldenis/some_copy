import {
  CASHIER_POS_ITEM_1_MOCK,
  CASHIER_POS_ITEM_2_MOCK,
  CASHIER_POS_ITEM_3_MOCK,
  CASHIER_POS_ITEM_4_MOCK,
  CASHIER_POS_ITEM_5_MOCK,
} from '@api/controllers/fiscalization/mock/cashier-pos.mock';
import {
  VEHICLE_10_MOCK,
  VEHICLE_1_MOCK,
  VEHICLE_2_MOCK,
  VEHICLE_3_MOCK,
  VEHICLE_4_MOCK,
  VEHICLE_5_MOCK,
  VEHICLE_6_MOCK,
  VEHICLE_7_MOCK,
  VEHICLE_8_MOCK,
  VEHICLE_9_MOCK,
} from '@api/controllers/fiscalization/mock/vehicles.mock';
import {
  FleetCashPointStatus,
  FleetVehicleFiscalizationCollectionDto,
  FleetVehicleWithFiscalizationDto,
} from '@data-access';

export const FISCALIZATION_VEHICLE_1_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_1_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_1_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_2_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_2_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_2_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_3_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_3_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_3_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_4_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_4_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_4_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_5_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_5_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_6_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_6_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_7_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_7_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_8_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_8_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_9_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_9_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLE_10_MOCK: FleetVehicleWithFiscalizationDto = {
  vehicle: VEHICLE_10_MOCK,
  cashierPos: {
    ...CASHIER_POS_ITEM_5_MOCK,
    status: FleetCashPointStatus.CLOSED,
  },
};

export const FISCALIZATION_VEHICLES_COLLECTION_MOCK: FleetVehicleFiscalizationCollectionDto = {
  data: [
    FISCALIZATION_VEHICLE_1_MOCK,
    FISCALIZATION_VEHICLE_2_MOCK,
    FISCALIZATION_VEHICLE_3_MOCK,
    FISCALIZATION_VEHICLE_4_MOCK,
    FISCALIZATION_VEHICLE_5_MOCK,
    FISCALIZATION_VEHICLE_6_MOCK,
    FISCALIZATION_VEHICLE_7_MOCK,
    FISCALIZATION_VEHICLE_8_MOCK,
    FISCALIZATION_VEHICLE_9_MOCK,
    FISCALIZATION_VEHICLE_10_MOCK,
  ],
  total: 10,
};
