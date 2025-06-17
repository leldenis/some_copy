import {
  BlockedListStatusValue,
  DriverPhotoControlCreatingReason,
  DriverStatus,
  KarmaGroup,
  TicketStatus,
} from '@constant';
import {
  CashLimitType,
  DriverCashLimitDto,
  DriverDetailsPhotoControlDto,
  EmployeeRestrictionDetailsDto,
  FleetDriversCollection,
  FleetDriversItemDto,
} from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  count: number;
  total_count?: number;
  photo_control?: DriverDetailsPhotoControlDto;
  drivers?: FleetDriversItemDto[];
  cash_limit?: DriverCashLimitDto;
  restrictions?: EmployeeRestrictionDetailsDto[];
}>;

const DEFAULT_COUNT = 10;
const GUID_MID_TIME_PART_LENGTH = 4;

export class DriverCollectionModule extends ModuleBase<FleetDriversCollection, BuildProps> {
  public buildDto(props?: BuildProps): FleetDriversCollection {
    return {
      total_count: props?.total_count ?? DEFAULT_COUNT,
      items:
        props?.drivers ??
        Array.from({ length: props?.count ?? DEFAULT_COUNT })
          .map((_, idx) => this.buildDriver(idx, props))
          .sort((a, b) => a.last_name.localeCompare(b.last_name) || a.first_name.localeCompare(b.first_name)),
    };
  }

  private buildDriver(idx: number, props?: BuildProps): FleetDriversItemDto {
    return {
      id: `8110174c-${idx.toString().padStart(GUID_MID_TIME_PART_LENGTH, '0')}-4ccb-8746-d72c234b7f5b`,
      block_status: {
        value: BlockedListStatusValue.ACTIVE,
      },
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: '576016567751',
      signal: 500_273,
      rating: 500,
      karma: {
        group: KarmaGroup.FIRST_PRIORITY,
        value: 100,
      },
      status: DriverStatus.WORKING,
      photo_control: props?.photo_control ?? {
        ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
        deadline_to_send: 1_735_793_865,
        block_immediately: false,
        status: TicketStatus.DRAFT,
        reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
        reason_comment: 'some photo missed',
      },
      cash_limit: props?.cash_limit ?? {
        limit: { amount: this.faker.number.int({ min: 10_000, max: 30_000 }), currency: Currency.UAH },
        used_amount: { amount: this.faker.number.int({ min: 10_000, max: 30_000 }), currency: Currency.UAH },
        type: CashLimitType.FLEET,
      },
      restrictions: props?.restrictions ?? [],
    };
  }
}
