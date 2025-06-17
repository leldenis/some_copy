import { Restriction, RestrictionReason } from '@constant';
import { EmployeeRestrictionDetailsDto, EmployeeRestrictionItemDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeRestrictionItemEntity implements EmployeeRestrictionItemDto {
  @ApiProperty({ type: String })
  public fleet_id: string;

  @ApiProperty({ enum: Restriction, enumName: 'Restriction' })
  public type: Restriction;

  @ApiPropertyOptional({ type: Number })
  public actual_from?: number;
}

export class EmployeeRestrictionDetailsEntity implements EmployeeRestrictionDetailsDto {
  @ApiProperty({ enum: RestrictionReason, enumName: 'RestrictionReason' })
  public restricted_by: RestrictionReason;

  @ApiProperty({ type: EmployeeRestrictionItemEntity, isArray: true })
  public restriction_items: EmployeeRestrictionItemDto[];
}
