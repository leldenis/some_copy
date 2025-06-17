import { SectorTagEntity } from '@api/controllers/geolocation/entities';
import {
  DriverOrderFilterDto,
  DriverOrderFilterDistanceDto,
  DriverOrderFilterTariffCostDto,
  DriverOrderFilterPaymentDto,
  DriverOrderFilterPickupTimeDto,
  DriverOrderFiltersDto,
  DriverOrderFiltersCollectionDto,
  DriverOrderFilterSectorsDto,
  DriverOrderFilterTariffDto,
  DriverOrderFilterTariffDistanceDto,
  SectorTagDto,
  FeeType,
  DriverOrderFilterTypeVersion,
  DriverOrderFilterCostValueDto,
  DriverOrderFilterCostDto,
  DriverOrderFilterLocalityDto,
  LocalityType,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class DriverOrderFilterDistanceEntity implements DriverOrderFilterDistanceDto {
  @ApiProperty({ type: Number })
  public max_distance_km: number;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterTariffDistanceEntity implements DriverOrderFilterTariffDistanceDto {
  @ApiProperty({ type: Number })
  public distance_km: number;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterPaymentEntity implements DriverOrderFilterPaymentDto {
  @ApiProperty({ enum: FeeType, isArray: true, enumName: 'FeeType' })
  public payment_types: FeeType[];

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterSectorsEntity implements DriverOrderFilterSectorsDto {
  @ApiPropertyOptional({ type: String, isArray: true })
  public sector_ids?: string[];

  @ApiPropertyOptional({ type: SectorTagEntity, isArray: true })
  public sectors_tags?: SectorTagDto[][];

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterPickupTimeEntity implements DriverOrderFilterPickupTimeDto {
  @ApiProperty({ type: String })
  public order_pickup_time_type: string;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterTariffCostEntity implements DriverOrderFilterTariffCostDto {
  @ApiProperty({ type: Number })
  public cost: number;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency_code: Currency;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterCostValueEntity implements DriverOrderFilterCostValueDto {
  @ApiProperty({ type: Number })
  public value: number;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency_code: Currency;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterTariffEntity implements DriverOrderFilterTariffDto {
  @ApiPropertyOptional({ type: DriverOrderFilterTariffCostEntity })
  public minimal_tariff_cost?: DriverOrderFilterTariffCostDto;

  @ApiPropertyOptional({ type: DriverOrderFilterTariffCostEntity })
  public min_cost_per_km?: DriverOrderFilterTariffCostDto;

  @ApiPropertyOptional({ type: DriverOrderFilterTariffCostEntity })
  public min_cost_per_suburban_km?: DriverOrderFilterTariffCostDto;

  @ApiPropertyOptional({ type: DriverOrderFilterTariffDistanceEntity })
  public minimal_tariff_distance?: DriverOrderFilterTariffDistanceDto;

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFilterCostEntity implements DriverOrderFilterCostDto {
  @ApiPropertyOptional({ type: DriverOrderFilterCostValueEntity })
  public minimal?: DriverOrderFilterCostValueDto;

  @ApiPropertyOptional({ type: DriverOrderFilterCostValueEntity })
  public minimal_per_km?: DriverOrderFilterCostValueDto;
}

export class DriverOrderFilterLocalityEntity implements DriverOrderFilterLocalityDto {
  @ApiProperty({ enum: LocalityType, enumName: 'LocalityType', isArray: true })
  public type: LocalityType[];

  @ApiProperty({ type: Boolean })
  public is_enabled: boolean;
}

export class DriverOrderFiltersEntity implements DriverOrderFiltersDto {
  @ApiProperty({ type: DriverOrderFilterDistanceEntity })
  public distance: DriverOrderFilterDistanceDto;

  @ApiProperty({ type: DriverOrderFilterPaymentEntity })
  public payment: DriverOrderFilterPaymentDto;

  @ApiPropertyOptional({ type: DriverOrderFilterSectorsEntity })
  public include_source_sectors?: DriverOrderFilterSectorsDto;

  @ApiPropertyOptional({ type: DriverOrderFilterSectorsEntity })
  public include_destination_sectors?: DriverOrderFilterSectorsDto;

  @ApiPropertyOptional({ type: DriverOrderFilterSectorsEntity })
  public exclude_source_sectors?: DriverOrderFilterSectorsDto;

  @ApiPropertyOptional({ type: DriverOrderFilterSectorsEntity })
  public exclude_destination_sectors?: DriverOrderFilterSectorsDto;

  @ApiProperty({ type: DriverOrderFilterPickupTimeEntity })
  public pickup_time: DriverOrderFilterPickupTimeDto;

  @ApiPropertyOptional({ type: DriverOrderFilterTariffEntity })
  public tariff?: DriverOrderFilterTariffDto;

  @ApiPropertyOptional({ type: DriverOrderFilterCostEntity })
  public cost?: DriverOrderFilterCostDto;

  @ApiPropertyOptional({ type: DriverOrderFilterLocalityEntity })
  public locality?: DriverOrderFilterLocalityDto;
}

export class DriverOrderFilterEntity implements DriverOrderFilterDto {
  @ApiProperty({ type: String })
  public filter_id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: Number })
  public offer_enabled_at: number;

  @ApiProperty({ type: Boolean })
  public for_offer: boolean;

  @ApiProperty({ type: Number })
  public broadcast_enabled_at: number;

  @ApiProperty({ type: Boolean })
  public for_broadcast: boolean;

  @ApiProperty({ type: Number })
  public loop_enabled_at: number;

  @ApiProperty({ type: Boolean })
  public for_loop: boolean;

  @ApiProperty({ type: DriverOrderFiltersEntity })
  public filters: DriverOrderFiltersDto;

  @ApiPropertyOptional({ enum: DriverOrderFilterTypeVersion, enumName: 'DriverOrderFilterTypeVersion' })
  public type_version?: DriverOrderFilterTypeVersion;
}

export class DriverOrderFiltersCollectionEntity implements DriverOrderFiltersCollectionDto {
  @ApiProperty({ type: DriverOrderFilterEntity, isArray: true })
  public order_filters: DriverOrderFilterDto[];
}
