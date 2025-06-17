import { BlockedListStatusDto } from '../blocked-list';

import { FleetDto } from './fleet.dto';
import { Locale } from './locale';

export interface AccountDto {
  user_id: string;
  last_name: string;
  first_name: string;
  phone: string;
  email: string;
  locale: Locale;
  fleets: FleetDto[];
  mfa_enabled: boolean;
  status?: BlockedListStatusDto;
}
