import { MakesDictionaryEntity } from '@api/controllers/dictionaries/entities/makes-dictionary.entity';
import { MakesDictionaryDto, DictionaryCollectionDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class MakesDictionaryCollectionEntity implements DictionaryCollectionDto<MakesDictionaryDto> {
  @ApiProperty({ type: MakesDictionaryEntity, isArray: true })
  public items: MakesDictionaryDto[];
}
