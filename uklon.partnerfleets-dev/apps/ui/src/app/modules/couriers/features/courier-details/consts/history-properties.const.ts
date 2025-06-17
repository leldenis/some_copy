import { CourierHistoryChangeItemDetailsDto, CourierHistoryProfileChangeProps } from '@data-access';

export const COURIER_HISTORY_PROPS_MAP: Record<
  CourierHistoryProfileChangeProps,
  {
    new: keyof CourierHistoryChangeItemDetailsDto;
    old: keyof CourierHistoryChangeItemDetailsDto;
  }
> = {
  date_of_birth: { new: 'new_date_of_birth', old: 'old_date_of_birth' },
  first_name: { new: 'new_first_name', old: 'old_first_name' },
  last_name: { new: 'new_last_name', old: 'old_last_name' },
  patronymic: { new: 'new_patronymic', old: 'old_patronymic' },
  email: { new: 'new_email', old: 'old_email' },
  sex: { new: 'new_sex', old: 'old_sex' },
  locale: { new: 'new_locale', old: 'old_locale' },
  id_number: { new: 'new_id_number', old: 'old_id_number' },
  value: { new: 'new_value', old: 'old_value' },
};
