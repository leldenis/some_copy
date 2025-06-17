import { TicketStatus } from '@constant';
import { CollectionCursorDto, FleetDriverRegistrationTicketDto } from '@data-access';

import { ModuleBase } from '../../../_internal';

export type BuildProps = Partial<{
  items?: FleetDriverRegistrationTicketDto[];
  count_items: number;
}>;

const DEFAULT_COUNT = 10;

export class DriverTicketsListModule extends ModuleBase<CollectionCursorDto<FleetDriverRegistrationTicketDto>> {
  public buildDto(props?: BuildProps): CollectionCursorDto<FleetDriverRegistrationTicketDto> {
    return {
      next_cursor: '0',
      previous_cursor: '0',
      items:
        props.items ??
        Array.from({ length: props?.count_items ?? DEFAULT_COUNT }).map((_, index) =>
          this.buildTicket.bind(index, this),
        ),
    };
  }

  private buildTicket(): FleetDriverRegistrationTicketDto {
    return {
      id: this.faker.string.uuid(),
      first_name: this.faker.person.firstName(),
      last_name: this.faker.person.lastName(),
      phone: `380${this.faker.phone.number()}`,
      created_at: 1_727_691_852,
      status: TicketStatus.DRAFT,
    };
  }
}
