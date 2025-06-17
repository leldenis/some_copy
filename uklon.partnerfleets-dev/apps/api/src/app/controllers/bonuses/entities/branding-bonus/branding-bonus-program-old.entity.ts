import { BrandingBonusCalcSourceEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-calc-source.entity';
import { BrandingBonusEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus.entity';
import { DriverBasicInfoEntity } from '@api/controllers/drivers/entities/driver-name-by-id.entitiy';
import { FleetVehicleBasicInfoEntity } from '@api/controllers/vehicles/entities';
import {
  BrandingBonusProgramsOldDto,
  BrandingBonusCalcSourceDto,
  BrandingBonusDto,
  FleetDriverBasicInfoDto,
  VehicleBasicInfoDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandingBonusProgramOldEntity implements BrandingBonusProgramsOldDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiPropertyOptional({ type: String })
  public vehicle_id?: string;

  @ApiProperty({ type: BrandingBonusCalcSourceEntity })
  public calculation_source: BrandingBonusCalcSourceDto;

  @ApiProperty({ type: BrandingBonusEntity })
  public bonus: BrandingBonusDto;

  @ApiProperty({ type: String })
  public wallet_id: string;

  @ApiPropertyOptional({ type: FleetVehicleBasicInfoEntity })
  public vehicle?: VehicleBasicInfoDto;

  @ApiPropertyOptional({ type: DriverBasicInfoEntity })
  public driver?: FleetDriverBasicInfoDto;
}
