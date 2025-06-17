import { FeedbackStatus, FleetDriverFeedbackDto, InfinityScrollCollectionDto, TemplateComment } from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  items: FleetDriverFeedbackDto[];
  has_more_items: boolean;
}>;

export class DriverFeedbacksModule extends ModuleBase<InfinityScrollCollectionDto<FleetDriverFeedbackDto>> {
  public buildDto(props?: BuildProps): InfinityScrollCollectionDto<FleetDriverFeedbackDto> {
    return {
      has_more_items: props?.has_more_items ?? false,
      items: props?.items ?? [
        {
          driver: {
            id: '73709b95-4a71-487a-bd1e-1bd3539f6a11',
            last_name: 'Aqaafeyh404',
            first_name: 'Aqadpilu404',
          },
          created_at: 1_730_297_889,
          mark: 5,
          template_comments: [TemplateComment.NICE_VEHICLE],
          status: FeedbackStatus.CONFIRMED,
          comment: '-',
        },
      ],
    };
  }
}
