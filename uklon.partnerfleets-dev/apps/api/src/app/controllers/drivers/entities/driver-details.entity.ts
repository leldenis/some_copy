import { EmployeeRestrictionDetailsEntity } from '@api/common/entities';
import { DriverBlockListStatusEntity } from '@api/controllers/drivers/entities/driver-block-list-status-entity';
import { DriverKarmaEntity } from '@api/controllers/drivers/entities/driver-karma.entity';
import { DriverPhotoControlEntity } from '@api/controllers/drivers/entities/driver-photo-control.entity';
import { DriverSelectedVehicleEntity } from '@api/controllers/drivers/entities/driver-selected-vehicle.entity';
import {
  DriverKarmaDto,
  DriverSelectedVehicleDto,
  FleetDriverDto,
  DriverPaymentInfoDto,
  BlockedListStatusDto,
  DriverDetailsPhotoControlDto,
  EmployeeRestrictionDetailsDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { DriverPaymentInfoEntity } from './driver-payment-info.entity';

export class DriverDetailsEntity implements FleetDriverDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public license: string;

  @ApiProperty({ type: Number })
  public signal: number;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ type: Number })
  public rating: number;

  @ApiProperty({ type: DriverKarmaEntity })
  public karma: DriverKarmaDto;

  @ApiProperty({ type: Number })
  public employed_from: number;

  @ApiProperty({ type: DriverBlockListStatusEntity })
  public status: BlockedListStatusDto;

  @ApiPropertyOptional({ type: DriverSelectedVehicleEntity })
  public selected_vehicle?: DriverSelectedVehicleDto;

  @ApiPropertyOptional({ type: DriverPaymentInfoEntity })
  public payment_details?: DriverPaymentInfoDto;

  @ApiPropertyOptional({ type: DriverPhotoControlEntity })
  public photo_control?: DriverDetailsPhotoControlDto;

  @ApiPropertyOptional({ type: EmployeeRestrictionDetailsEntity, isArray: true })
  public delayed_restrictions?: EmployeeRestrictionDetailsDto[];
}
