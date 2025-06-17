import {
  BlockedListStatusReason,
  BlockedListStatusValue,
  DriverPhotoControlCreatingReason,
  DriverPhotosCategory,
  TicketStatus,
} from '@constant';
import { DriverPhotoControlTicketItemDto, DriverPhotoControlTicketsCollection } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  items?: DriverPhotoControlTicketItemDto[];
  count?: number;
}>;

const DEFAULT_COUNT = 10;

export class DriverPhotoControlListModule extends ModuleBase<DriverPhotoControlTicketsCollection> {
  public buildDto(props?: BuildProps): DriverPhotoControlTicketsCollection {
    return {
      next_cursor: '0',
      previous_cursor: '0',
      items: Array.from({ length: props?.count ?? DEFAULT_COUNT }).map((_, index) => this.buildPhotoControl(index)),
    };
  }

  private buildPhotoControl(index: number): DriverPhotoControlTicketItemDto {
    return {
      id: this.faker.string.uuid(),
      status: this.getTicketStatus(index),
      deadline_to_send: 1_732_658_399,
      picture_types: [
        DriverPhotosCategory.PROFILE,
        DriverPhotosCategory.LICENSE_FRONT,
        DriverPhotosCategory.LICENSE_REVERSE,
        DriverPhotosCategory.RESIDENCE,
        DriverPhotosCategory.ID_CARD_FRONT,
        DriverPhotosCategory.ID_CARD_REVERSE,
        DriverPhotosCategory.CRIMINAL_RECORD_CERTIFICATE,
        DriverPhotosCategory.COMBATANT_STATUS_CERTIFICATE,
      ],
      created_at: 1_731_880_800,
      driver_id: '293418fc-3fe8-4b0b-ab88-e98c1a9dedfa',
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: `380${this.faker.phone.number()}`,
      signal: '502224',
      driver_status: {
        value: BlockedListStatusValue.BLOCKED,
        reason: BlockedListStatusReason.BY_SELF_EMPLOYMENT,
        reasons: [BlockedListStatusReason.PHOTO_CONTROL, BlockedListStatusReason.PHOTO_CONTROL_PASSED],
      },
      reasons: [
        DriverPhotoControlCreatingReason.AFTER_FIRST_ORDERS,
        DriverPhotoControlCreatingReason.DOCUMENTS_OR_PHOTO_ABSENCE,
        DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION,
        DriverPhotoControlCreatingReason.PROFILE_DATA_ACTUALIZATION,
        DriverPhotoControlCreatingReason.ADDITIONAL_DOCUMENTS_GATHERING,
        DriverPhotoControlCreatingReason.OTHER,
      ],
      reason_comment: 'reason comment test',
    };
  }

  private getTicketStatus(index: number): TicketStatus {
    const statusMap: Record<number, TicketStatus> = {
      0: TicketStatus.DRAFT,
      1: TicketStatus.SENT,
      2: TicketStatus.REVIEW,
      3: TicketStatus.CLARIFICATION,
      4: TicketStatus.APPROVED,
      5: TicketStatus.REJECTED,
      6: TicketStatus.REJECTED,
      7: TicketStatus.DRAFT,
      8: TicketStatus.CLARIFICATION,
      9: TicketStatus.SENT,
      10: TicketStatus.DRAFT,
      11: TicketStatus.BLOCKED_BY_MANAGER,
    };

    if (index < Object.keys(statusMap).length) {
      return statusMap[index];
    }

    return TicketStatus.DRAFT;
  }
}
