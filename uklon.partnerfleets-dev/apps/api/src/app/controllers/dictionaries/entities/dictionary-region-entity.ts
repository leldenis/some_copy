import { Language, RegionDictionaryItemDto, RegionLocaleSettingsDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { Currency } from '@uklon/types';

export class RegionLocaleSettingsEntity implements RegionLocaleSettingsDto {
  @ApiProperty({ enum: Language, isArray: true, enumName: 'Language' })
  public allowed: Language[];

  @ApiProperty({ enum: Language, enumName: 'Language' })
  public default: Language;
}

export class RegionDictionaryEntity implements RegionDictionaryItemDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: String })
  public code: string;

  @ApiProperty({ type: String })
  public country_code: string;

  @ApiProperty({ enum: Currency, enumName: 'Currency' })
  public currency: Currency;

  @ApiProperty({ type: RegionLocaleSettingsEntity })
  public locale_settings: RegionLocaleSettingsDto;
}
