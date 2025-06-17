import { DictionaryDto, FleetVehicleOption, VehicleOptionDictionaryItemDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class DictionaryEntity implements DictionaryDto {
  @ApiPropertyOptional({ type: Number })
  public id?: number;

  @ApiProperty({ type: String })
  public code: string;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;
}

export class VehicleOptionDictionaryItemEntity implements VehicleOptionDictionaryItemDto {
  @ApiProperty({ enum: FleetVehicleOption, enumName: 'FleetVehicleOption' })
  public code: FleetVehicleOption;

  @ApiProperty({ type: Boolean })
  public is_driver_editable: boolean;
}
