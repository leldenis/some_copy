import { DriverHistoryChangeItemDetailsDto, DriverHistoryProfileChangeProps } from '@data-access';

export const DRIVER_HISTORY_PROPS_MAP: Record<
  DriverHistoryProfileChangeProps,
  {
    new: keyof DriverHistoryChangeItemDetailsDto;
    old: keyof DriverHistoryChangeItemDetailsDto;
  }
> = {
  has_citizenship: { new: 'new_has_citizenship', old: 'old_has_citizenship' },
  license: { new: 'new_license', old: 'old_license' },
  date_of_birth: { new: 'new_date_of_birth', old: 'old_date_of_birth' },
  license_till: { new: 'new_license_till', old: 'old_license_till' },
  disability_types: { new: 'new_disability_types', old: 'old_disability_types' },
  payment_details: { new: 'new_payment_details', old: 'old_payment_details' },
  first_name: { new: 'new_first_name', old: 'old_first_name' },
  last_name: { new: 'new_last_name', old: 'old_last_name' },
  patronymic: { new: 'new_patronymic', old: 'old_patronymic' },
  email: { new: 'new_email', old: 'old_email' },
  sex: { new: 'new_sex', old: 'old_sex' },
  locale: { new: 'new_locale', old: 'old_locale' },
  id_number: { new: 'new_id_number', old: 'old_id_number' },
  value: { new: 'current_value', old: 'old_value' },
};

export const VEHICLE_HISTORY_PROPS_MAP: Record<string, { old: string; new: string }> = {
  insurance_policy_number: {
    new: 'new_insurance_policy_number',
    old: 'old_insurance_policy_number',
  },
  insurance_policy_actual_to: {
    new: 'new_insurance_policy_actual_to',
    old: 'old_insurance_policy_actual_to',
  },
  production_year: { new: 'new_production_year', old: 'old_production_year' },
  body_type: { new: 'new_body_type', old: 'old_body_type' },
  color: { new: 'new_color', old: 'old_color' },
  comfort_level: { new: 'new_comfort_level', old: 'old_comfort_level' },
  fuels: { new: 'added_fuels', old: 'removed_fuels' },
  passenger_seats_count: {
    new: 'new_passenger_seats_count',
    old: 'old_passenger_seats_count',
  },
  model_details: { new: 'new_model_details', old: 'old_model_details' },
  load_capacity: {
    new: 'new_load_capacity',
    old: 'old_load_capacity',
  },
};
