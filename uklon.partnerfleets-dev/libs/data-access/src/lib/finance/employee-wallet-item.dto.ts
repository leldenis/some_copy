import { EntityType } from '@constant';

import { CollectionCursorDto } from '../collection-cursor.dto';

import { MoneyDto } from './money.dto';
import { WalletDto } from './wallet.dto';

export type EmployeeWalletsCollection = CollectionCursorDto<EmployeeWalletItemDto>;
export type EmployeeWalletsTotalBalance = MoneyDto;

export interface EmployeeWalletItemDto {
  employee_id?: string;
  driver_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  signal?: number;
  wallet?: WalletDto;
  type?: EntityType;
}
