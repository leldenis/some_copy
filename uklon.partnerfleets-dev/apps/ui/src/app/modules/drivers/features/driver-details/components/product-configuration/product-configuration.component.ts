import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  DriverAccessibilityRulesMetricsDto,
  DriverProductConfigurationsDto,
  ProductAccessibilityRulesDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { ProductAccessibilityComponent } from '@ui/modules/drivers/features/driver-details/components/product-accessibility/product-accessibility.component';
import { NormalizeStringPipe, UIService } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { map, Observable, share } from 'rxjs';

const METRIC_TO_RULE_COMPARSION_MAP = new Map<
  keyof DriverAccessibilityRulesMetricsDto,
  keyof ProductAccessibilityRulesDto
>([
  ['rating', 'min_rating'],
  ['completed_orders_count', 'min_completed_order_count'],
  ['working_days', 'min_work_time_days'],
]);

@Component({
  selector: 'upf-product-configuration',
  standalone: true,
  imports: [
    NormalizeStringPipe,
    TranslateModule,
    MatIcon,
    AsyncPipe,
    NgxTippyModule,
    MatSlideToggle,
    ReactiveFormsModule,
    MatIconButton,
    ProductAccessibilityComponent,
  ],
  templateUrl: './product-configuration.component.html',
  styleUrls: ['./product-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductConfigurationComponent implements OnChanges {
  @Input() public driverId: string;
  @Input() public fleetId: string;
  @Input() public configuration: DriverProductConfigurationsDto;
  @Input() public isDriverBlocked: boolean;

  @Output() public configurationChange = new EventEmitter<Partial<DriverProductConfigurationsDto>>();
  @Output() public readonly close = this.matSidenav.closedStart;

  @HostBinding('attr.data-cy')
  public attribute = 'product-configuration';

  public metrics$: Observable<DriverAccessibilityRulesMetricsDto>;

  public hasHint$: Observable<boolean>;

  public readonly isEditableByDriver = new FormControl<boolean>(false);

  constructor(
    @Inject(ICONS)
    public readonly icons: IconsConfig,
    private readonly uiService: UIService,
    private readonly matSidenav: MatDrawer,
    private readonly driverService: DriverService,
  ) {}

  public ngOnChanges({ configuration, driverId, fleetId }: SimpleChanges): void {
    if (configuration?.currentValue) {
      this.isEditableByDriver.patchValue(!this.configuration.to_allow_edit_by_driver);

      if (this.isDriverBlocked) {
        this.isEditableByDriver.disable();
      }
    }

    if (driverId?.currentValue && fleetId?.currentValue) {
      this.metrics$ = this.driverService.getDriverAccessibilityRulesMetrics(this.fleetId, this.driverId).pipe(share());
      this.hasHint$ = this.metrics$.pipe(map((metrics) => this.compareWithRules(metrics)));
    }
  }

  public handleIsEditableByDriverChange(value: boolean): void {
    this.configurationChange.emit({ to_allow_edit_by_driver: !value });
  }

  public async handleCancelClick(): Promise<void> {
    await this.uiService.toggleDynamicComponentSidebar();
  }

  private compareWithRules(metrics: DriverAccessibilityRulesMetricsDto): boolean {
    const accessibility = this.configuration.accessibility_rules;
    const accessibilityEditing = this.configuration.editing_accessibility_rules;

    const isAccessible = [...METRIC_TO_RULE_COMPARSION_MAP.entries()].some(
      ([metricKey, ruleKey]) => metrics[metricKey] > accessibility[ruleKey],
    );
    const isEditingAccessible = [...METRIC_TO_RULE_COMPARSION_MAP.entries()].some(
      ([metricKey, ruleKey]) => metrics[metricKey] > accessibilityEditing[ruleKey],
    );

    return !(isAccessible || isEditingAccessible);
  }
}
