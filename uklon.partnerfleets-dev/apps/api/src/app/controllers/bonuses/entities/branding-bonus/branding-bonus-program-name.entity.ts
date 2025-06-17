import { BonusBrandingProgramNameDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingBonusProgramNameEntity implements BonusBrandingProgramNameDto {
  @ApiProperty({ type: String })
  public id: string;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: String })
  public status: string;
}
