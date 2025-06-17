import { KarmaGroup } from '@constant';
import { DriverBaseKarmaDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class DriverBaseKarmaEntity implements DriverBaseKarmaDto {
  @ApiProperty({ enum: KarmaGroup, enumName: 'KarmaGroup' })
  public group: KarmaGroup;

  @ApiProperty({ type: Number })
  public value: number;
}
