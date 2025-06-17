import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { DateRangeDto, getCurrentWeek } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CouriersFeedbackFiltersDto } from '@ui/modules/feedback/models/feedback.dto';
import { CouriersAutocompleteComponent, DateTimeRangeControlComponent } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';

@Component({
  selector: 'upf-couriers-feedbacks-filters',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    DateTimeRangeControlComponent,
    CouriersAutocompleteComponent,
    MatLabel,
    TranslateModule,
  ],
  templateUrl: './couriers-feedbacks-filters.component.html',
  styleUrls: ['./couriers-feedbacks-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersFeedbacksFiltersComponent {
  @Input() public isMobileView: boolean;
  @Input() public fleetId: string;

  @Output() public filtersChange = new EventEmitter<CouriersFeedbackFiltersDto>();

  public readonly filterKey = StorageFiltersKey.COURIERS_FEEDBACKS;
  public filterGroup = new FormGroup({
    period: new FormControl<DateRangeDto>(getCurrentWeek()),
    courierId: new FormControl<string>(''),
  });
}
