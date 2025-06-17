import { ProductRulesActivationsDto } from '../products/product-rules-activations.dto';

export interface SetDriverProductConfigurationDto {
  to_allow_edit_by_driver: boolean;
  editing_restriction_reason?: string;
  accessibility_rules_activations: ProductRulesActivationsDto;
  editing_accessibility_rules_activations: ProductRulesActivationsDto;
}
