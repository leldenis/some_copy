import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSort, SortDirection } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { EmployeeWalletsFilterDto } from '@ui/modules/finance/models/employee-wallets-filter.dto';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-driver-balances-filter',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslateModule,
    MatIcon,
    MatInput,
    MatSelect,
    MatOption,
    MatSuffix,
  ],
  templateUrl: './driver-balances-filter.component.html',
  styleUrls: ['./driver-balances-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverBalancesFilterComponent {
  @Input() public fleetId: string;
  @Input({ required: true }) public filterKey: StorageFiltersKey;
  @Input() public value: EmployeeWalletsFilterDto;

  @Output() public filtersChange = new EventEmitter<EmployeeWalletsFilterDto>();
  @Output() public sortChange = new EventEmitter<Partial<MatSort>>();

  public readonly sortOptions = [
    { key: 'DriverBalancesFilter.Sort.Options.Default', value: '' },
    { key: 'DriverBalancesFilter.Sort.Options.Desc', value: 'desc' },
    { key: 'DriverBalancesFilter.Sort.Options.Asc', value: 'asc' },
  ];

  public sortControl = new FormControl('');
  public filtersForm = new FormGroup({
    name: new FormControl<string>(''),
    phone: new FormControl<string>(''),
  });

  public readonly icons = inject(ICONS);

  public onSortChange(direction: SortDirection): void {
    this.sortChange.emit({ direction, active: 'Balance' });
  }
}
