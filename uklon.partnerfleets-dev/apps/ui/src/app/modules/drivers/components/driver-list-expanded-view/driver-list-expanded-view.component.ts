import { AsyncPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DriverStatus } from '@constant';
import { Driver } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverFiltersPipe } from '@ui/modules/live-map/pipes/driver-filters.pipe';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-driver-list-expanded-view',
  templateUrl: './driver-list-expanded-view.component.html',
  styleUrls: ['./driver-list-expanded-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, DecimalPipe, RouterLink, NgxTippyModule, MatIcon, AsyncPipe, DriverFiltersPipe],
})
export class DriverListExpandedViewComponent {
  @HostBinding('class.fired') public get fired(): boolean {
    return this.driver().status === DriverStatus.FIRED;
  }

  public readonly driver = input.required<Driver>();

  public readonly showActiveFilters = output<string>();

  public readonly vehicleDetailsPath = `/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.DETAILS}`;

  public onShowActiveFilters(driverId: string, isLink: boolean): void {
    if (!isLink) return;

    this.showActiveFilters.emit(driverId);
  }
}
