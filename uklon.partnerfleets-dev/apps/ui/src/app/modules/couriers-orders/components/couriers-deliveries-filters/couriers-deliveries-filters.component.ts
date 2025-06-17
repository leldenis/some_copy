import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderStatus } from '@constant';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import {
  CouriersAutocompleteComponent,
  DateTimeRangeControlComponent,
  MAT_FORM_FIELD_IMPORTS,
  MAT_SELECT_IMPORTS,
} from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

import { CourierDeliveriesFiltersDto } from '../../models';

@Component({
  selector: 'upf-couriers-deliveries-filters',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    CouriersAutocompleteComponent,
  ],
  templateUrl: './couriers-deliveries-filters.component.html',
  styleUrls: ['./couriers-deliveries-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersDeliveriesFiltersComponent {
  @Input() public fleetId: string;

  @Output() public filtersChange = new EventEmitter<CourierDeliveriesFiltersDto>();

  public readonly filterKey = StorageFiltersKey.COURIERS_DELIVERIES;
  public readonly deliveryStatus = [OrderStatus.CANCELED, OrderStatus.COMPLETED, OrderStatus.RUNNING];
  public readonly filtersForm = new FormGroup({
    status: new FormControl<OrderStatus | ''>(''),
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
    courierId: new FormControl<string>(''),
  });
}
