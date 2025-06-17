import { BlockedListStatusDto } from '../blocked-list';

export interface FleetContactDto {
  role: string;
  mfa_enabled: boolean;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  driver_id?: string;
  status: BlockedListStatusDto;
}
