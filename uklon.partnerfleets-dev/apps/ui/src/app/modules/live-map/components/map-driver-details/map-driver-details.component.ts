import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { EmployeeLocationStatus, LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { MapPhotoControlIconComponent } from '@ui/modules/live-map/components/map-photo-control-icon/map-photo-control-icon.component';
import { DriverFiltersPipe } from '@ui/modules/live-map/pipes/driver-filters.pipe';
import { FullNamePipe, StatusBadgeComponent } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LOCATION_STATUS_STYLING } from '@ui/shared/modules/live-map-shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-map-driver-details',
  standalone: true,
  imports: [
    StatusBadgeComponent,
    TranslateModule,
    DefaultImgSrcDirective,
    NgxTippyModule,
    FullNamePipe,
    MapPhotoControlIconComponent,
    MatIcon,
    DriverFiltersPipe,
    AsyncPipe,
  ],
  templateUrl: './map-driver-details.component.html',
  styleUrls: ['./map-driver-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDriverDetailsComponent {
  public readonly employee = input.required<LiveMapEmployeeDto>();
  public readonly showStatus = input<boolean>(false);

  public readonly showActiveFilters = output<string>();

  public readonly statusStyling = LOCATION_STATUS_STYLING;
  public readonly driverPath = DriverPaths;
  public readonly path = CorePaths;
  public readonly employeeStatus = EmployeeLocationStatus;

  public onShowActiveFilters(employeeId: string, isLink: boolean): void {
    if (!isLink) return;

    this.showActiveFilters.emit(employeeId);
  }
}
