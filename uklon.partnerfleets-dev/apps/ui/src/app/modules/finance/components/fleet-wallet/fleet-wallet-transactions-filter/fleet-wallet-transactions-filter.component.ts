import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { TransactionsFilterDto } from '@ui/modules/finance/models/fleet-wallet-transactions-filter.dto';
import { DateTimeRangeControlComponent } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

const DEFAULT_RANGE = getCurrentWeek();

@Component({
  selector: 'upf-fleet-wallet-transactions-filter',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    MatFormField,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
    MatLabel,
  ],
  templateUrl: './fleet-wallet-transactions-filter.component.html',
  styleUrls: ['./fleet-wallet-transactions-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetWalletTransactionsFilterComponent {
  public filterKey = input.required<StorageFiltersKey>();

  public filtersChanged = output<TransactionsFilterDto>();

  public filtersForm = new FormGroup({
    date: new FormControl(DEFAULT_RANGE),
  });
}
