import { OrderRecordQueryDto } from '@data-access';
import { Expose, Type } from 'class-transformer';

export class OrderQueryEntity implements OrderRecordQueryDto {
  @Expose()
  @Type(() => String)
  public driverId: string;
}
