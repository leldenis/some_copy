import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CouriersAutocompleteComponent, DateTimeRangeControlComponent, MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

import { CourierReportsFiltersDto } from '../../models';

@Component({
  selector: 'upf-couriers-reports-filters',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    CouriersAutocompleteComponent,
  ],
  templateUrl: './couriers-reports-filters.component.html',
  styleUrls: ['./couriers-reports-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersReportsFiltersComponent {
  @Input() public fleetId: string;

  @Output() public filtersChange = new EventEmitter<CourierReportsFiltersDto>();

  public readonly filterKey = StorageFiltersKey.COURIERS_REPORTS;
  public readonly filtersForm = new FormGroup({
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
    courierId: new FormControl<string>(''),
  });
}
