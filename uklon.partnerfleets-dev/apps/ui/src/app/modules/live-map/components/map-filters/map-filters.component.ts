import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FleetAnalyticsEventType, LiveMapFiltersDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { CustomValidators, MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-map-filters',
  standalone: true,
  imports: [MAT_FORM_FIELD_IMPORTS, MatIcon, MatInput, ReactiveFormsModule, FiltersContainerComponent, TranslateModule],
  templateUrl: './map-filters.component.html',
  styleUrls: ['./map-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapFiltersComponent {
  @Input({ required: true }) public isMobileView: boolean;

  @Output() public filtersChange = new EventEmitter<LiveMapFiltersDto>();
  @Output() public analyticsChange = new EventEmitter<{
    type: FleetAnalyticsEventType;
    controlName: string;
  }>();

  public readonly filterKey = StorageFiltersKey.LIVE_MAP;
  public readonly eventType = FleetAnalyticsEventType;

  public filtersForm = new FormGroup({
    name: new FormControl<string>(''),
    licensePlate: new FormControl<string>('', CustomValidators.licensePlate()),
  });

  public readonly icons = inject(ICONS);

  public onResetFilters(controlName: keyof LiveMapFiltersDto = null): void {
    if (!controlName) {
      this.filtersForm.reset({ name: '', licensePlate: '' });
      return;
    }

    this.filtersForm.get(controlName).reset('');
    this.sendAnalytics(FleetAnalyticsEventType.LIVE_MAP_FILTERS_CLEARED, controlName);
  }

  public sendAnalytics(type: FleetAnalyticsEventType, controlName: string): void {
    this.analyticsChange.emit({ type, controlName });
  }
}
