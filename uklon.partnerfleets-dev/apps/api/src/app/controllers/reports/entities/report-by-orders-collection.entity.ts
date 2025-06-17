import { ReportByOrdersEntity } from '@api/controllers/reports';
import { ReportByOrdersCollectionDto, ReportByOrdersDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ReportByOrdersCollectionEntity implements ReportByOrdersCollectionDto {
  @ApiProperty({ type: Boolean })
  public has_more_items: boolean;

  @ApiProperty({ type: ReportByOrdersEntity, isArray: true })
  public items: ReportByOrdersDto[];
}
