import { BlockedListStatusValue, BodyType } from '@constant';
import { FleetVehicleCollectionQueryDto } from '@data-access';
import { Expose, Transform, Type } from 'class-transformer';

const transformBoolean = (value: string): boolean | string => {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return value;
};

export class FleetVehicleCollectionQueryEntity implements FleetVehicleCollectionQueryDto {
  @Expose({ name: 'license_plate', toPlainOnly: true })
  @Type(() => String)
  public licencePlate?: string;

  @Expose({ name: 'is_branded', toPlainOnly: true })
  @Transform(({ value }) => transformBoolean(value))
  public hasBranding?: boolean;

  @Expose({ name: 'has_dispatching_priority', toPlainOnly: true })
  @Transform(({ value }) => transformBoolean(value))
  public hasPriority?: boolean;

  @Expose({ name: 'body_type', toPlainOnly: true })
  @Type(() => String)
  public bodyType?: BodyType;

  @Expose()
  @Type(() => Number)
  public offset?: number;

  @Expose()
  @Type(() => Number)
  public limit?: number;

  @Expose({ name: 'status' })
  @Type(() => String)
  public status?: BlockedListStatusValue;
}
