import { DictionaryEntity } from '@api/controllers/dictionaries/entities/dictionary.entity';
import { DictionaryCollectionDto, DictionaryDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DictionaryCollectionEntity implements DictionaryCollectionDto<DictionaryDto> {
  @ApiProperty({ type: DictionaryEntity, isArray: true })
  public items: DictionaryDto[];
}
