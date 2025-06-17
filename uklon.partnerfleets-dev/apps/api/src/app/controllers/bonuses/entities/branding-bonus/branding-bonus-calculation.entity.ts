import { BrandingBonusCalcSourceEntity } from '@api/controllers/bonuses/entities';
import { BrandingBonusEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus.entity';
import { DriverBasicInfoEntity } from '@api/controllers/drivers/entities/driver-name-by-id.entitiy';
import { FleetVehicleBasicInfoEntity } from '@api/controllers/vehicles/entities';
import {
  BrandingBonusDto,
  FleetDriverBasicInfoDto,
  VehicleBasicInfoDto,
  BrandingBonusProgramCalculationDto,
  BrandingBonusCalcSourceDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingBonusCalculationEntity implements BrandingBonusProgramCalculationDto {
  @ApiProperty({ type: String })
  public calculation_item_id: string;

  @ApiProperty({ type: String })
  public participant_id: string;

  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ type: String })
  public vehicle_id: string;

  @ApiProperty({ type: String })
  public bonus_receiver_wallet_id: string;

  @ApiProperty({ type: BrandingBonusEntity })
  public bonus: BrandingBonusDto;

  @ApiProperty({ type: BrandingBonusCalcSourceEntity })
  public calculation_source: BrandingBonusCalcSourceDto;

  @ApiPropertyOptional({ type: FleetVehicleBasicInfoEntity })
  public vehicle?: VehicleBasicInfoDto;

  @ApiPropertyOptional({ type: DriverBasicInfoEntity })
  public driver?: FleetDriverBasicInfoDto;
}
