import { AvailableDriverProduct, DriverFleetType } from '@constant';
import { DriverProductConfigurationsCollectionDto, DriverProductConfigurationsDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  products?: DriverProductConfigurationsCollectionDto;
  products_count?: number;
  products_list?: DriverProductConfigurationsDto[];
}>;

const DEFAULT_COUNT = 10;

export class DriverProductsConfigurationsModule extends ModuleBase<
  DriverProductConfigurationsCollectionDto,
  BuildProps
> {
  private readonly defaultRules = {
    driver_fleet_type: DriverFleetType.ALL,
    max_allowed_cancel_percent: 100,
    min_completed_order_count: 0,
    min_rating: 0,
    min_work_time_days: 0,
  };

  private readonly defaultRulesActivations = {
    driver_fleet_type_enabled: true,
    max_allowed_cancel_percent_enabled: true,
    min_completed_order_count_enabled: true,
    min_rating_enabled: true,
    min_work_time_days_enabled: true,
  };

  public buildDto(props?: BuildProps): DriverProductConfigurationsCollectionDto {
    return {
      items: props?.products_list?.length
        ? props.products_list.map((product, _index) => this.buildProductConfiguration(product))
        : Array.from({ length: props?.products_count ?? DEFAULT_COUNT }).map(() => this.buildProductConfiguration()),
    };
  }

  public buildProductConfiguration(productFromList?: DriverProductConfigurationsDto): DriverProductConfigurationsDto {
    return {
      accessibility_rules: this.mergeWithDefaults(this.defaultRules, productFromList?.accessibility_rules),
      accessibility_rules_activations: this.mergeWithDefaults(
        this.defaultRulesActivations,
        productFromList?.accessibility_rules_activations,
      ),
      availability: productFromList?.availability ?? {
        is_available: true,
        is_blocked: false,
        is_restricted_by_accessibility_rules: false,
        is_restricted_by_selected_vehicle: false,
        is_restricted_by_vehicle_params: false,
      },
      editing_accessibility_rules: this.mergeWithDefaults(
        this.defaultRules,
        productFromList?.editing_accessibility_rules,
      ),
      editing_accessibility_rules_activations: this.mergeWithDefaults(
        this.defaultRulesActivations,
        productFromList?.editing_accessibility_rules_activations,
      ),
      is_editable: productFromList?.is_editable ?? true,
      is_restricted_for_edit_by_rules: productFromList?.is_restricted_for_edit_by_rules ?? false,
      product: productFromList?.product ?? {
        id: this.faker.string.uuid(),
        name: AvailableDriverProduct.Standard,
        code: AvailableDriverProduct.Standard,
        condition_code: 'Standard',
        condition_value: 'Standard',
      },
      to_allow_edit_by_driver: productFromList?.to_allow_edit_by_driver ?? true,
      block_reason: productFromList?.block_reason ?? 'test',
    };
  }

  private mergeWithDefaults<T>(defaults: T, values?: Partial<T>): T {
    return { ...defaults, ...values };
  }
}
