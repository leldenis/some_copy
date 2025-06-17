import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FleetEmployeeType } from '@constant';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DateTimeRangeControlComponent } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

@Component({
  selector: 'upf-statistic-filters',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    TranslateModule,
    DateTimeRangeControlComponent,
  ],
  templateUrl: './statistic-filters.component.html',
  styleUrls: ['./statistic-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticFiltersComponent {
  @Input() public fleetEmployeeType = FleetEmployeeType.DRIVER;
  @Input() public filterKey: string;
  @Input() public filterSubKey: string;

  @Output() public filtersChange = new EventEmitter<DateRangeDto>();

  public filterForm = new FormGroup({
    dateRange: new FormControl<DateRangeDto>(getCurrentWeek()),
  });
}
