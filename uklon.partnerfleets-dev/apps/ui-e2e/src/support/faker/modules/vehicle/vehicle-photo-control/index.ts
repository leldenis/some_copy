import { TicketInitiatorType, TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import {
  PhotoType,
  PictureUrlDto,
  TicketActivityLogItemDto,
  TicketCommentDto,
  VehiclePhotoControlTicketDto,
} from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  deadline_to_send?: number;
  license_plate?: string;
  id?: string;
  status?: TicketStatus;
  images?: Record<PhotoType, PictureUrlDto>;
  activity_log?: TicketActivityLogItemDto[];
  comment?: TicketCommentDto[];
  pictureTypes?: VehiclePhotosCategory[];
}>;

export class VehiclePhotoControlModule extends ModuleBase<VehiclePhotoControlTicketDto> {
  public buildDto(props?: BuildProps): VehiclePhotoControlTicketDto {
    const baseData = this.getBaseData(props);
    const ticketData = this.getTicketData(props);

    return {
      ...baseData,
      ...ticketData,
    };
  }

  private getBaseData(props?: BuildProps): {
    id: string;
    type: TicketType;
    vehicle_id: string;
    deadline_to_send: number | null;
    picture_types: VehiclePhotosCategory[];
    activity_log: TicketActivityLogItemDto[];
    block_immediately: boolean;
  } {
    return {
      id: props?.id ?? this.faker.string.uuid(),
      type: TicketType.VEHICLE_PHOTO_CONTROL,
      vehicle_id: this.faker.string.uuid(),
      deadline_to_send: props?.deadline_to_send ?? null,
      picture_types: this.getPictureTypes(props),
      activity_log: this.getActivityLog(props),
      block_immediately: false,
    };
  }

  private getTicketData(props?: BuildProps): {
    comments: TicketCommentDto[];
    initiator: string;
    initiator_data: { type: TicketInitiatorType; first_name: string; last_name: string };
    region_id: number;
    can_be_edited: boolean;
    status: TicketStatus;
    reviewer_id: string;
    license_plate: string;
    images: Record<PhotoType, PictureUrlDto>;
  } {
    return {
      comments: this.getComments(props),
      initiator: 'UklonManager',
      initiator_data: this.getInitiatorData(),
      region_id: 1,
      can_be_edited: true,
      status: props?.status ?? TicketStatus.DRAFT,
      reviewer_id: '',
      license_plate: props?.license_plate ?? 'TEST123',
      images: this.getImages(props),
    };
  }

  private getPictureTypes(props?: BuildProps): VehiclePhotosCategory[] {
    return (
      props?.pictureTypes ?? [VehiclePhotosCategory.VEHICLE_ANGLED_BACK, VehiclePhotosCategory.VEHICLE_ANGLED_FRONT]
    );
  }

  private getActivityLog(props?: BuildProps): TicketActivityLogItemDto[] {
    return (
      props?.activity_log ?? [
        {
          status: TicketStatus.DRAFT,
          actual_from: 1,
          transferred_by_account_id: '',
          transferred_by_full_name: '',
          comment: 'ByVehicleModel',
          clarification_details: {
            comment: '',
          },
        },
      ]
    );
  }

  private getComments(props?: BuildProps): TicketCommentDto[] {
    return (
      props?.comment ?? [
        {
          comment: '',
          created_at: 1,
          full_name: '',
          email: '',
        },
      ]
    );
  }

  private getInitiatorData(): {
    type: TicketInitiatorType;
    first_name: string;
    last_name: string;
  } {
    return {
      type: TicketInitiatorType.MANAGER,
      first_name: '',
      last_name: '',
    };
  }

  private getImages(props?: BuildProps): Record<PhotoType, PictureUrlDto> {
    return props?.images ?? {};
  }
}
