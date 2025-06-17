import { EmployeeRestrictionDetailsEntity } from '@api/common/entities';
import { DriverBaseKarmaEntity } from '@api/controllers/drivers/entities/driver-base-karma.entity';
import { DriverPhotoControlEntity } from '@api/controllers/drivers/entities/driver-photo-control.entity';
import { DriverSelectedVehicleEntity } from '@api/controllers/drivers/entities/driver-selected-vehicle.entity';
import { MoneyEntity } from '@api/controllers/finance/entities';
import { DriverStatus } from '@constant';
import {
  DriverBaseKarmaDto,
  DriverSelectedVehicleDto,
  FleetDriversItemDto,
  DriverDetailsPhotoControlDto,
  DriverCashLimitDto,
  CashLimitType,
  MoneyDto,
  EmployeeRestrictionDetailsDto,
  DriverFilter,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverCashLimitEntity implements DriverCashLimitDto {
  @ApiProperty({ type: MoneyEntity })
  public limit: MoneyDto;

  @ApiProperty({ type: MoneyEntity })
  public used_amount: MoneyDto;

  @ApiProperty({ enum: CashLimitType, enumName: 'CashLimitType' })
  public type: CashLimitType;
}

export class DriverEntity implements FleetDriversItemDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: Number })
  public signal: number;

  @ApiProperty({ type: Number })
  public rating: number;

  @ApiProperty({ type: DriverBaseKarmaEntity })
  public karma: DriverBaseKarmaDto;

  @ApiProperty({ enum: DriverStatus, enumName: 'DriverStatus' })
  public status: DriverStatus;

  @ApiPropertyOptional({ type: DriverSelectedVehicleEntity })
  public selected_vehicle?: DriverSelectedVehicleDto;

  @ApiPropertyOptional({ type: DriverPhotoControlEntity })
  public photo_control?: DriverDetailsPhotoControlDto;

  @ApiPropertyOptional({ type: DriverCashLimitEntity })
  public cash_limit?: DriverCashLimitDto;

  @ApiPropertyOptional({ type: EmployeeRestrictionDetailsEntity, isArray: true })
  public restrictions?: EmployeeRestrictionDetailsDto[];

  @ApiPropertyOptional({ enum: DriverFilter, isArray: true })
  public active_driver_filters?: DriverFilter[];
}
