import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { CashLimitType, FleetAnalyticsEventType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { DriversFilterDto } from '@ui/modules/drivers/models';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { NgxMaskDirective } from 'ngx-mask';
import { ICONS } from '@ui/shared/tokens';

const FILTER_TO_ANALYTICS = new Map<keyof DriversFilterDto, FleetAnalyticsEventType>([
  ['name', FleetAnalyticsEventType.FINANCE_CASH_LIMITS_NAME_FILTER],
  ['phone', FleetAnalyticsEventType.FINANCE_CASH_LIMITS_PHONE_FILTER],
  ['cash_limit_type', FleetAnalyticsEventType.FINANCE_CASH_LIMITS_CASH_LIMIT_TYPE_FILTER],
  ['has_restriction_by_cash_limit', FleetAnalyticsEventType.FINANCE_CASH_LIMITS_HAS_RESTRICTION_BY_CASH_LIMIT_FILTER],
]);

@Component({
  selector: 'upf-cash-limits-filters',
  standalone: true,
  imports: [
    CommonModule,
    FiltersContainerComponent,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NgxMaskDirective,
    ReactiveFormsModule,
    TranslateModule,
    MatCheckbox,
  ],
  templateUrl: './cash-limits-filters.component.html',
  styleUrl: './cash-limits-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashLimitsFiltersComponent {
  public filtersChange = output<DriversFilterDto>();

  public readonly filterKey = StorageFiltersKey.CASH_LIMITS;
  public readonly limitType = CashLimitType;

  public filtersForm = new FormGroup({
    name: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    cash_limit_type: new FormControl<CashLimitType | ''>(''),
    has_restriction_by_cash_limit: new FormControl<boolean>(false),
  });

  public readonly icons = inject(ICONS);
  private readonly analytics = inject(AnalyticsService);

  public onFiltersChange(event: DriversFilterDto): void {
    this.filtersChange.emit(event);
  }

  public reportFiltersChange(filters: DriversFilterDto[]): void {
    filters.forEach((filter) => {
      const [key] = Object.keys(filter) as (keyof DriversFilterDto)[];

      if (FILTER_TO_ANALYTICS.has(key)) {
        this.analytics.reportEvent(FILTER_TO_ANALYTICS.get(key), { [key]: filter[key] });
      }
    });
  }
}
