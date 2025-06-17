import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { OrderStatus, ProductType } from '@constant';
import { AnalyticsTripsFilter, DateRangeDto, FleetAnalyticsEventType, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageFiltersKey, StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { OrderFilterDto } from '@ui/modules/orders/models/order-filter.dto';
import {
  DateTimeRangeControlComponent,
  DriversAutocompleteComponent,
  MAT_FORM_FIELD_IMPORTS,
  MAT_SELECT_IMPORTS,
  NormalizeStringPipe,
} from '@ui/shared';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { LoaderButtonComponent } from '@ui/shared/components/loader-button/loader-button.component';
import { ICONS } from '@ui/shared/tokens/icons.token';
import * as _ from 'lodash';

@Component({
  selector: 'upf-trips-filter',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    DateTimeRangeControlComponent,
    TranslateModule,
    DriversAutocompleteComponent,
    MatInput,
    MatIcon,
    NormalizeStringPipe,
    LoaderButtonComponent,
    NgTemplateOutlet,
    FiltersActionButtonDirective,
  ],
  templateUrl: './trips-filter.component.html',
  styleUrls: ['./trips-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripsFilterComponent {
  @Input() public fleetId: string;
  @Input() public disableCSVButton = false;
  @Input() public isDownloading = false;

  @Output() public filtersChange = new EventEmitter<OrderFilterDto>();

  @Output() public exportCsv = new EventEmitter<void>();

  public orderStatusList: OrderStatus[] = [OrderStatus.CANCELED, OrderStatus.COMPLETED, OrderStatus.RUNNING];
  public productTypeList: ProductType[] = [
    ProductType.BUSINESS,
    ProductType.COMFORT_PLUS,
    ProductType.COVID_PROTECTED,
    ProductType.DELIVERY,
    ProductType.DRIVER,
    ProductType.ECONOM,
    ProductType.GREEN,
    ProductType.MINIVAN,
    ProductType.POOL,
    ProductType.PREMIUM,
    ProductType.STANDARD,
    ProductType.WAGON,
  ];
  public filtersForm = new FormGroup({
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
    status: new FormControl<string>(''),
    productType: new FormControl<string>(''),
    licencePlate: new FormControl<string>(''),
    driverId: new FormControl<string>(''),
  });

  public readonly filterKey = StorageFiltersKey.ORDER;

  public readonly icons = inject(ICONS);
  public readonly analytics = inject(AnalyticsService);
  public readonly storage = inject(StorageService);

  public onFiltersChange(filters: OrderFilterDto): void {
    this.filtersChange.emit(filters);
  }

  public onExportCsv(): void {
    this.exportCsv.emit();
  }

  public reportFiltersChange(): void {
    const {
      licencePlate,
      dateRange: { from, to },
      driverId,
      productType,
      status,
    } = this.filtersForm.getRawValue();

    let customProps: AnalyticsTripsFilter = {
      licence_plate: licencePlate,
      driver_id: driverId,
      start_date: from,
      end_date: to,
      product_type: productType,
      status_type: status,
    };
    customProps = _.omitBy(customProps, (val) => val === '' || val === null);

    this.analytics.reportEvent<AnalyticsTripsFilter>(FleetAnalyticsEventType.ORDER_TRIPS_FILTERS, {
      user_access: this.storage.get(userRoleKey),
      ...customProps,
    });
  }
}
