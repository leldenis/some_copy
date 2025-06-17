import { ProductAccessibilityRulesEntity } from '@api/common/entities/products/product-accessibility-rules.entity';
import { ProductAvailabilityEntity } from '@api/common/entities/products/product-availability.entity';
import { ProductRulesActivationsEntity } from '@api/common/entities/products/product-rules-activations.entity';
import {
  ProductAccessibilityRulesDto,
  ProductAvailabilityDto,
  ProductConfigurationsDto,
  ProductRulesActivationsDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class ProductConfigurationEntity implements ProductConfigurationsDto {
  @ApiProperty({ type: ProductAvailabilityEntity })
  public availability: ProductAvailabilityDto;

  @ApiProperty({ type: Boolean })
  public is_editable: boolean;

  @ApiProperty({ type: Boolean })
  public to_allow_edit_by_driver: boolean;

  @ApiProperty({ type: Boolean })
  public is_restricted_for_edit_by_rules: boolean;

  @ApiProperty({ type: String })
  public block_reason: string;

  @ApiProperty({ type: ProductAccessibilityRulesEntity })
  public accessibility_rules: ProductAccessibilityRulesDto;

  @ApiProperty({ type: ProductAccessibilityRulesEntity })
  public editing_accessibility_rules: ProductAccessibilityRulesDto;

  @ApiProperty({ type: ProductRulesActivationsEntity })
  public accessibility_rules_activations: ProductRulesActivationsDto;

  @ApiProperty({ type: ProductRulesActivationsEntity })
  public editing_accessibility_rules_activations: ProductRulesActivationsDto;
}
