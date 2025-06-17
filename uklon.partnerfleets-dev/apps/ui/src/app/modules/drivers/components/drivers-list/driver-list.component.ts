import { AsyncPipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BlockedListStatusValue, TicketStatus } from '@constant';
import { FleetDriversItemDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverListExpandedViewComponent } from '@ui/modules/drivers/components/driver-list-expanded-view/driver-list-expanded-view.component';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { DriverFiltersPipe } from '@ui/modules/live-map/pipes/driver-filters.pipe';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { FullNamePipe, PhotoControlIconComponent, UIService } from '@ui/shared';
import { PaginationComponent } from '@ui/shared/components/pagination';
import { EnvironmentModel } from '@ui-env/environment.model';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { APP_CONFIG } from '@uklon/angular-core';

@Component({
  selector: 'upf-drivers-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatAccordion,
    TranslateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    NgTemplateOutlet,
    MatIcon,
    NgClass,
    DecimalPipe,
    RouterLink,
    NgxTippyModule,
    FullNamePipe,
    PhotoControlIconComponent,
    DriverListExpandedViewComponent,
    DriverFiltersPipe,
    PaginationComponent,
  ],
})
export class DriverListComponent {
  public readonly total = input.required<number>();
  public readonly drivers = input<FleetDriversItemDto[]>([]);

  public readonly unlinkVehicle = output<{ id: string; placeholder: string }>();
  public readonly showActiveFilters = output<string>();

  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly ticketStatus = TicketStatus;
  public readonly blockedStatus = BlockedListStatusValue;
  public readonly appConfig = inject<EnvironmentModel>(APP_CONFIG);
  public readonly isMobileView$ = inject(UIService).breakpointMatch();

  public unlink(driver: FleetDriversItemDto): void {
    const id = driver?.selected_vehicle?.vehicle_id;
    const { make, model, license_plate } = driver.selected_vehicle;
    const placeholder = `${make} ${model} ${license_plate}`;
    this.unlinkVehicle.emit({ id, placeholder });
  }

  public onShowActiveFilters(driverId: string, hasDetails: boolean): void {
    if (!hasDetails) return;

    this.showActiveFilters.emit(driverId);
  }
}
