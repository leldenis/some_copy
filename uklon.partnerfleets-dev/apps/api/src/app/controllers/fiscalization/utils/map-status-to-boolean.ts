import { FiscalizationStatusValue, FleetFiscalizationStatusDto } from '@data-access';

export const mapStatusToBoolean = <T extends { status?: FiscalizationStatusValue }>(
  item: T,
): T & FleetFiscalizationStatusDto => {
  return {
    ...item,
    status: item.status === FiscalizationStatusValue.ENABLED,
  };
};
