import { DictionaryDto, RegionDictionaryItemDto, VehicleOptionDictionaryItemDto } from './dictionary.dto';
import { MakesDictionaryDto } from './makes-dictionary.dto';

export interface DictionariesListDto {
  regions: RegionDictionaryItemDto[];
  colors: DictionaryDto[];
  body_types: DictionaryDto[];
  comfort_levels: DictionaryDto[];
  options: VehicleOptionDictionaryItemDto[];
  makes: MakesDictionaryDto[];
  years: number[];
}
