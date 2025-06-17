import { BrandingSpecOrderCountEntity } from '@api/controllers/bonuses/entities/branding-bonus/branding-bonus-spec-order-count.entity';
import { BrandingProgramParamsOrdersDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class BrandingProgramParamsOrdersEntity implements BrandingProgramParamsOrdersDto {
  @ApiProperty({ type: Object })
  public completed: {
    count: BrandingSpecOrderCountEntity[];
  };

  @ApiProperty({ type: Object })
  public cancelled: {
    percent: BrandingSpecOrderCountEntity[];
  };
}
