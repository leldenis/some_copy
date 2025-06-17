import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FleetAnalyticsEventType, LiveMapFiltersDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-couriers-map-filters',
  standalone: true,
  imports: [MAT_FORM_FIELD_IMPORTS, FiltersContainerComponent, ReactiveFormsModule, TranslateModule, MatInput, MatIcon],
  templateUrl: './couriers-map-filters.component.html',
  styleUrls: ['./couriers-map-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersMapFiltersComponent {
  @Input({ required: true }) public isMobileView: boolean;

  @Output() public refreshGeolocation = new EventEmitter<void>();
  @Output() public filtersChange = new EventEmitter<LiveMapFiltersDto>();
  @Output() public analyticsChange = new EventEmitter<{
    type: FleetAnalyticsEventType;
    controlName: string;
  }>();

  public readonly filterKey = StorageFiltersKey.COURIERS_LIVE_MAP;
  public readonly eventType = FleetAnalyticsEventType;

  public couriersFiltersForm = new FormGroup({
    name: new FormControl<string>(''),
  });

  public readonly icons = inject(ICONS);

  public onResetFilters(): void {
    this.couriersFiltersForm.reset({ name: '' });
    this.sendAnalytics(FleetAnalyticsEventType.LIVE_MAP_FILTERS_CLEARED, 'name');
  }

  public sendAnalytics(type: FleetAnalyticsEventType, controlName: string): void {
    this.analyticsChange.emit({ type, controlName });
  }
}
