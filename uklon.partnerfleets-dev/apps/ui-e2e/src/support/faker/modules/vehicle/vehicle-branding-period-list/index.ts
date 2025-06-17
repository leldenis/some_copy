import { TicketStatus } from '@constant';
import { CollectionCursorDto, VehicleBrandingPeriodTicketItemDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: VehicleBrandingPeriodTicketItemDto[];
  count?: number;
}>;

const DEFAULT_COUNT = 30;

export class VehicleBrandingPeriodListModule extends ModuleBase<
  CollectionCursorDto<VehicleBrandingPeriodTicketItemDto>
> {
  public buildDto(props?: BuildProps): CollectionCursorDto<VehicleBrandingPeriodTicketItemDto> {
    return {
      next_cursor: '0',
      previous_cursor: '0',
      items:
        props?.items ??
        Array.from({ length: props?.count ?? DEFAULT_COUNT }).map(() => this.buildVehicleBrandingPeriodList()),
    };
  }

  private buildVehicleBrandingPeriodList(): VehicleBrandingPeriodTicketItemDto {
    return {
      id: this.faker.string.uuid(),
      status: TicketStatus.DRAFT,
      created_at: 1_736_760_267,
      vehicle_id: '235fefc0-a50b-4e8a-b630-362f2e6ac5bc',
      deadline_to_send: 1_737_624_267,
      monthly_code: '961848',
      model_id: '6d428b61-1a70-40da-8f43-6ea1e22c5f39',
      model: 'Continental GT V8 S',
      make_id: 'd772cab1-410a-4ae5-9b99-e3ff7c1093c0',
      make: 'Bentley',
      production_year: 2012,
      license_plate: this.faker.string.alphanumeric({ casing: 'upper', length: 8 }),
      color: 'White',
    };
  }
}
