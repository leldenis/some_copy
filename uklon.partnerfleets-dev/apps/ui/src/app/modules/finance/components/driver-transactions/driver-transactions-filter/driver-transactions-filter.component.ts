/* eslint-disable complexity */
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { TransactionsFiltersDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';
import { DateTimeRangeControlComponent, DriversAutocompleteComponent } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

@Component({
  selector: 'upf-driver-transactions-filter',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    MatLabel,
    MatFormField,
    TranslateModule,
    ReactiveFormsModule,
    DateTimeRangeControlComponent,
    DriversAutocompleteComponent,
  ],
  templateUrl: './driver-transactions-filter.component.html',
  styleUrls: ['./driver-transactions-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverTransactionsFilterComponent {
  @Input() public fleetId: string;

  @Output() public filtersChange = new EventEmitter<TransactionsFiltersDto>();
  @Output() public filtersReset = new EventEmitter<void>();

  public readonly filterKey = StorageFiltersKey.DRIVER_TRANSACTIONS;

  public filtersForm = new FormGroup({
    date: new FormControl<DateRangeDto>(getCurrentWeek()),
    driverId: new FormControl<string>(''),
  });
}
