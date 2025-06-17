import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { BlockedListStatusValue, DriverStatus } from '@constant';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens';
import { NgxMaskDirective } from 'ngx-mask';

import { DriversFilterDto } from '../../models';

@Component({
  selector: 'upf-driver-filter',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslateModule,
    MatInput,
    MatIcon,
    NgxMaskDirective,
    MatOption,
    MatSelect,
    MatSuffix,
    FiltersActionButtonDirective,
  ],
  templateUrl: './driver-filter.component.html',
  styleUrls: ['./driver-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverFilterComponent {
  @Output() public filtersChange = new EventEmitter<DriversFilterDto>();

  public readonly statuses = [DriverStatus.ALL, DriverStatus.WORKING, DriverStatus.FIRED, DriverStatus.BLOCKED];

  public readonly blockStatuses = [BlockedListStatusValue.ALL, BlockedListStatusValue.BLOCKED];
  public readonly filterKey = StorageFiltersKey.DRIVER_LIST;

  public filtersForm = new FormGroup({
    name: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    block_status: new FormControl<BlockedListStatusValue>(BlockedListStatusValue.ALL),
  });

  public readonly icons = inject(ICONS);

  public onFiltersChange(event: DriversFilterDto): void {
    this.filtersChange.emit(event);
  }
}
