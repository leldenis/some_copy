import { CourierActivitySettingsEntity } from '@api/controllers/couriers/entities/courier-activity-rate.entity';
import { CourierItemEntity } from '@api/controllers/couriers/entities/courier-item.entity';
import { CourierActivitySettingsDto, CourierDetailsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CouriersDetailsEntity extends CourierItemEntity implements CourierDetailsDto {
  @ApiProperty({ type: Object })
  public profile_photo: {
    link: string;
    link_expiration: number;
  };

  @ApiProperty({ type: Boolean })
  public unregistered: boolean;

  @ApiProperty({ type: Number })
  public unregistered_at: number;

  @ApiProperty({ type: Object })
  public orders_statistics: {
    completed_count: number;
    rejected_count: number;
    canceled_count: number;
  };

  @ApiProperty({ type: CourierActivitySettingsEntity })
  public activitySettings: CourierActivitySettingsDto;
}
