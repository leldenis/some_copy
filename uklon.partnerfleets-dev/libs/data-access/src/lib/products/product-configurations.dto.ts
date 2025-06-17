import { ProductAccessibilityRulesDto } from './product-accessibility-rules.dto';
import { ProductAvailabilityDto } from './product-availability.dto';
import { ProductRulesActivationsDto } from './product-rules-activations.dto';

export interface ProductConfigurationsDto {
  availability: ProductAvailabilityDto;
  is_editable: boolean;
  to_allow_edit_by_driver: boolean;
  is_restricted_for_edit_by_rules: boolean;
  block_reason: string;
  accessibility_rules: ProductAccessibilityRulesDto;
  editing_accessibility_rules: ProductAccessibilityRulesDto;
  accessibility_rules_activations: ProductRulesActivationsDto;
  editing_accessibility_rules_activations: ProductRulesActivationsDto;
}

export interface ProductConfigurationUpdateItemDto {
  product_id: string;
  is_available: boolean;
}

export interface ProductConfigurationUpdateItemCollectionDto {
  items: ProductConfigurationUpdateItemDto[];
}
