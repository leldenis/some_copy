import { RegionDictionaryEntity } from '@api/controllers/dictionaries/entities/dictionary-region-entity';
import {
  DictionaryEntity,
  VehicleOptionDictionaryItemEntity,
} from '@api/controllers/dictionaries/entities/dictionary.entity';
import { MakesDictionaryEntity } from '@api/controllers/dictionaries/entities/makes-dictionary.entity';
import {
  DictionariesListDto,
  DictionaryDto,
  MakesDictionaryDto,
  RegionDictionaryItemDto,
  VehicleOptionDictionaryItemDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DictionariesListEntity implements DictionariesListDto {
  @ApiProperty({ type: RegionDictionaryEntity, isArray: true })
  public regions: RegionDictionaryItemDto[];

  @ApiProperty({ type: DictionaryEntity, isArray: true })
  public colors: DictionaryDto[];

  @ApiProperty({ type: DictionaryEntity, isArray: true })
  public body_types: DictionaryDto[];

  @ApiProperty({ type: DictionaryEntity, isArray: true })
  public comfort_levels: DictionaryDto[];

  @ApiProperty({ type: VehicleOptionDictionaryItemEntity, isArray: true })
  public options: VehicleOptionDictionaryItemDto[];

  @ApiProperty({ type: MakesDictionaryEntity, isArray: true })
  public makes: MakesDictionaryDto[];

  @ApiProperty({ type: Number, isArray: true })
  public years: number[];
}
