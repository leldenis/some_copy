import { LiveMapLocationDto, NearestLocationDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

import { MapLocationEntity } from './map-location.entity';

export class NearestLocationEntity implements NearestLocationDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: Number })
  public city_id: number;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: String })
  public original_name: string;

  @ApiProperty({ type: String })
  public street: string;

  @ApiProperty({ type: String })
  // eslint-disable-next-line id-denylist,id-blacklist
  public number: string;

  @ApiProperty({ type: Boolean })
  public is_place: boolean;

  @ApiProperty({ type: MapLocationEntity })
  public centroid: LiveMapLocationDto;
}
