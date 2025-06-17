import { formatNumber, KeyValuePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, LOCALE_ID, OnChanges, SimpleChanges } from '@angular/core';
import { DriverAccessibilityRulesMetricsDto, ProductAccessibilityRulesDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

type PickByType<T, V> = {
  [P in keyof T]: T[P] extends V ? P : never;
}[keyof T];

type ProductAccessibilityRule = PickByType<ProductAccessibilityRulesDto, number>;
type ProductAccessibilityMetric = PickByType<DriverAccessibilityRulesMetricsDto, number>;

export interface DataListViewModel {
  title: string;
  value: string;
}

const PRODUCT_ACCESSIBILITY_RULE_INTL = new Map<ProductAccessibilityRule, DataListViewModel>([
  [
    'min_rating',
    {
      title: 'ProductAccessibility.Rule.Title.DriverRating',
      value: 'ProductAccessibility.Rule.Value.DriverRating',
    },
  ],
  [
    'min_completed_order_count',
    {
      title: 'ProductAccessibility.Rule.Title.DriverOrders',
      value: 'ProductAccessibility.Rule.Value.DriverOrders',
    },
  ],
  [
    'min_work_time_days',
    {
      title: 'ProductAccessibility.Rule.Title.DriverExperience',
      value: 'ProductAccessibility.Rule.Value.DriverExperience',
    },
  ],
]);

const PRODUCT_ACCESSIBILITY_METRIC_INTL = new Map<ProductAccessibilityMetric, DataListViewModel>([
  [
    'rating',
    {
      title: 'ProductAccessibility.Metric.Title.DriverRating',
      value: 'ProductAccessibility.Metric.Value.DriverRating',
    },
  ],
  [
    'completed_orders_count',
    {
      title: 'ProductAccessibility.Metric.Title.DriverOrders',
      value: 'ProductAccessibility.Metric.Value.DriverOrders',
    },
  ],
  [
    'working_days',
    {
      title: 'ProductAccessibility.Metric.Title.DriverExperience',
      value: 'ProductAccessibility.Metric.Value.DriverExperience',
    },
  ],
]);

export interface ProductAccessibilityViewModel {
  readonly title: string;
  readonly value: string;
  readonly valueParams: Record<string, string>;
  readonly ngClass?: string;
}

type AccessibilityTransformFn = (value: number) => string;

const transformRating = (locale: string): AccessibilityTransformFn => {
  return (value: number): string => {
    return formatNumber(value / 100, locale, '.1-1');
  };
};

@Component({
  selector: 'upf-product-accessibility',
  standalone: true,
  imports: [NgClass, TranslateModule, KeyValuePipe],
  templateUrl: './product-accessibility.component.html',
  styleUrls: ['./product-accessibility.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAccessibilityComponent implements OnChanges {
  @Input() public rules: ProductAccessibilityRulesDto;
  @Input() public metrics: DriverAccessibilityRulesMetricsDto;

  public viewModels: ProductAccessibilityViewModel[];

  constructor(@Inject(LOCALE_ID) private readonly localeId: string) {}

  public ngOnChanges({ rules, metrics }: SimpleChanges): void {
    if (this.rules && this.metrics && (rules || metrics)) {
      this.setViewModels();
    }
  }

  private setViewModels(): void {
    this.viewModels = [
      this.createForRule('min_rating', transformRating(this.localeId)),
      this.createForMetric('min_rating', 'rating', transformRating(this.localeId)),
      this.createForRule('min_completed_order_count'),
      this.createForMetric('min_completed_order_count', 'completed_orders_count'),
      this.createForRule('min_work_time_days'),
      this.createForMetric('min_work_time_days', 'working_days'),
    ];
  }

  private createForRule(
    ruleKey: ProductAccessibilityRule,
    transformFn?: AccessibilityTransformFn,
  ): ProductAccessibilityViewModel {
    const { title, value } = PRODUCT_ACCESSIBILITY_RULE_INTL.get(ruleKey);
    const rule = this.rules[ruleKey];
    const valueParams = { rule: transformFn ? transformFn(rule) : `${rule}` };
    return {
      title,
      value,
      valueParams,
    };
  }

  private createForMetric(
    ruleKey: ProductAccessibilityRule,
    metricKey: ProductAccessibilityMetric,
    transformFn?: AccessibilityTransformFn,
  ): ProductAccessibilityViewModel {
    const { title, value } = PRODUCT_ACCESSIBILITY_METRIC_INTL.get(metricKey);
    const rule = this.rules[ruleKey];
    const metric = this.metrics[metricKey];
    const valueParams = { metric: transformFn ? transformFn(metric) : `${metric}` };
    const ngClass = this.getMetricClass(rule, metric);
    return {
      title,
      value,
      valueParams,
      ngClass,
    };
  }

  private getMetricClass(rule: number, metric: number): string {
    if (!metric) {
      return '';
    }

    return rule > metric ? 'upf-danger' : 'upf-success';
  }
}
