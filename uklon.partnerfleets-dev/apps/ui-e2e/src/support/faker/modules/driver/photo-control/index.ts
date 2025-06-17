import { DriverPhotoControlCreatingReason, DriverPhotosCategory, TicketInitiatorType, TicketStatus } from '@constant';
import { DriverPhotoControlTicketDto, PhotoType, PictureUrlDto, TicketActivityLogItemDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  status: TicketStatus;
  pictureTypes: DriverPhotosCategory[];
  images: Record<PhotoType, PictureUrlDto>;
  activity_log: TicketActivityLogItemDto[];
  deadline_to_send: number;
}>;

export class DriverPhotoControlModule extends ModuleBase<DriverPhotoControlTicketDto> {
  public buildDto(props?: BuildProps): DriverPhotoControlTicketDto {
    return {
      id: 'b21e3c8f-b9e6-45e6-a769-052b36bbf5d1',
      driver_id: 'fbc741e2-4cd5-4a65-95f7-8154d48f646c',
      deadline_to_send: props?.deadline_to_send ?? null,
      block_immediately: false,
      picture_types: props?.pictureTypes ?? [
        DriverPhotosCategory.PROFILE,
        DriverPhotosCategory.LICENSE_FRONT,
        DriverPhotosCategory.LICENSE_REVERSE,
        DriverPhotosCategory.COMBATANT_STATUS_CERTIFICATE,
        DriverPhotosCategory.CRIMINAL_RECORD_CERTIFICATE,
        DriverPhotosCategory.ID_CARD_REVERSE,
        DriverPhotosCategory.ID_CARD_FRONT,
        DriverPhotosCategory.RESIDENCE,
      ],
      activity_log: props?.activity_log ?? [
        {
          status: TicketStatus.DRAFT,
          actual_from: 1,
          transferred_by_account_id: '',
          transferred_by_full_name: '',
          comment: '',
          clarification_details: {
            comment: '',
          },
        },
      ],
      comments: [
        {
          comment: '',
          created_at: 1,
          full_name: '',
          email: '',
        },
      ],
      initiator_data: {
        type: TicketInitiatorType.MANAGER,
        first_name: '',
        last_name: '',
      },
      region_id: 1,
      can_be_edited: true,
      status: props?.status ?? TicketStatus.DRAFT,
      reviewer_id: '',
      reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
      images: props?.images ?? {
        driver_avatar_photo: {
          fallback_url: '',
          url: '',
          uploaded_at: 1,
        },
      },
    };
  }
}
