import { FleetType } from '@data-access';

export const VEHICLE_FLEET_TYPES = new Set<FleetType>([FleetType.COMMERCIAL, FleetType.PRIVATE, FleetType.RENTAL]);

export const COURIER_FLEET_TYPES = new Set<FleetType>([FleetType.COURIER_FINANCE_MEDIATOR, FleetType.PRIVATE_COURIER]);
