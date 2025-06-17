import { TicketStatus, BlockedListStatusValue, VehiclePhotoControlCreatingReason } from '@constant';
import { CollectionCursorDto, VehiclePhotoControlTicketItemDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  items?: VehiclePhotoControlTicketItemDto[];
}>;

const DEFAULT_COUNT = 10;

export class FleetPhotoControlListModule extends ModuleBase<CollectionCursorDto<VehiclePhotoControlTicketItemDto>> {
  public buildDto(props?: BuildProps): CollectionCursorDto<VehiclePhotoControlTicketItemDto> {
    return {
      next_cursor: '0',
      previous_cursor: '0',
      items:
        props.items ??
        Array.from({ length: props?.items.length ?? DEFAULT_COUNT }).map((_, index) =>
          this.buildPhotoControl.bind(index, this),
        ),
    };
  }

  private buildPhotoControl(): VehiclePhotoControlTicketItemDto {
    return {
      created_at: 1_728_375_954,
      id: this.faker.string.uuid(),
      license_plate: this.faker.string.alphanumeric({ casing: 'upper' }),
      status: TicketStatus.DRAFT,
      model_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
      model: 'Audi',
      make: 'A8',
      make_id: '93d1ae2a-17f0-4e29-842e-b866eddfd8ed',
      production_year: 2024,
      color: 'White',
      deadline_to_send: 1_729_375_954,
      picture_types: ['driver_car_front_photo'],
      vehicle_status: {
        value: BlockedListStatusValue.BLOCKED,
      },
      reasons: [VehiclePhotoControlCreatingReason.BY_VEHICLE_MODEL],
    };
  }
}
