import { ModelsDictionaryEntity } from '@api/controllers/dictionaries/entities/models-dictionary.entity';
import { ModelsDictionaryDto, DictionaryCollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ModelsDictionaryCollectionEntity implements DictionaryCollectionDto<ModelsDictionaryDto> {
  @ApiProperty({ type: ModelsDictionaryEntity, isArray: true })
  public items: ModelsDictionaryDto[];
}
