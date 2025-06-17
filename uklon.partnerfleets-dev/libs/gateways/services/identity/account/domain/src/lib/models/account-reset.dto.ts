export interface AccountResetDto {
  user_contact: string | null;
  device_id: string; // uuid
  user_agent: string | null;
  locale_id: number;
}
