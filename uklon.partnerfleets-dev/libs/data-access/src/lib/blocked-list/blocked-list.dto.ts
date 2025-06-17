import { BlockedListStatusReason, BlockedListStatusValue } from '@constant';

export interface BlockedListStatusDto {
  value: BlockedListStatusValue;
  reason?: BlockedListStatusReason; // obsolete, but still uses for some api
  reasons?: BlockedListStatusReason[];
}
