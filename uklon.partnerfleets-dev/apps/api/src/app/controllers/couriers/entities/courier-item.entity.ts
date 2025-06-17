import { EmployeeRestrictionDetailsEntity } from '@api/common/entities';
import { CourierActivityRateDetailsEntity } from '@api/controllers/couriers/entities/courier-activity-rate.entity';
import { CourierRatingEntity } from '@api/controllers/couriers/entities/courier-rating.entity';
import { Sex } from '@constant';
import {
  CourierRatingDto,
  CourierItemDto,
  CourierActivityRateDetailsDto,
  EmployeeRestrictionDetailsDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class CourierItemEntity extends CourierActivityRateDetailsEntity implements CourierItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: Number })
  public registered_at: number;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public patronymic: string;

  @ApiProperty({ enum: Sex, enumName: 'Sex' })
  public sex: Sex;

  @ApiProperty({ type: Number })
  public date_of_birth: number;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public registration_region_id: number;

  @ApiProperty({ type: String })
  public id_number: string;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ type: EmployeeRestrictionDetailsEntity, isArray: true })
  public restrictions: EmployeeRestrictionDetailsDto[];

  @ApiProperty({ type: String })
  public locale: string;

  @ApiProperty({ type: CourierRatingEntity })
  public rating: CourierRatingDto;

  @ApiProperty({ type: String })
  public active_account_deletion_ticket_id: string;

  @ApiProperty({ type: CourierActivityRateDetailsEntity })
  public activity_rate: CourierActivityRateDetailsDto;
}
