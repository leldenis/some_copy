import { FleetHistoryChangeItemDetailsDto, FleetHistoryProfileChangeProps } from '@data-access';

export const FLEET_HISTORY_PROPS_MAP: Record<
  FleetHistoryProfileChangeProps,
  {
    new: keyof FleetHistoryChangeItemDetailsDto;
    old: keyof FleetHistoryChangeItemDetailsDto;
  }
> = {
  name: { new: 'new_name', old: 'old_name' },
  email: { new: 'new_email', old: 'old_email' },
  tax_number: { new: 'new_tax_number', old: 'old_tax_number' },
  fleet_type: { new: 'new_fleet_type', old: 'old_fleet_type' },
  id: { new: 'new_id', old: 'old_id' },
  merchant_id: { new: 'new_merchant_id', old: 'old_merchant_id' },
  entrepreneur_name: { new: 'new_entrepreneur_name', old: 'old_entrepreneur_name' },
  payment_providers: { new: 'new_payment_providers', old: 'old_payment_providers' },
  value: { new: 'current_value', old: 'old_value' },
};
