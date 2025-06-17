import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CourierTransactionsFiltersDto } from '@ui/modules/couriers-finance/models/courier-finance.dto';
import { CouriersAutocompleteComponent, DateTimeRangeControlComponent, MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

@Component({
  selector: 'upf-courier-transactions-filters',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    CouriersAutocompleteComponent,
  ],
  templateUrl: './courier-transactions-filters.component.html',
  styleUrls: ['./courier-transactions-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierTransactionsFiltersComponent {
  @Input({ required: true }) public fleetId: string;

  @Output() public filtersChange = new EventEmitter<CourierTransactionsFiltersDto>();

  public readonly filterKey = StorageFiltersKey.COURIER_TRANSACTIONS;
  public readonly filtersForm = new FormGroup({
    courierId: new FormControl<string>(''),
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
  });
}
