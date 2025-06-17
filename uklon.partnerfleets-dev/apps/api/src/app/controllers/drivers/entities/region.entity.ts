import { KarmaSettingsDto, RegionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { KarmaSettingsEntity } from './karma-settings.entity';

export class RegionEntity implements RegionDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: String })
  public code: string;

  @ApiProperty({ type: String })
  public country_code: string;

  @ApiProperty({ type: KarmaSettingsEntity })
  public karma_settings: KarmaSettingsDto;
}
