import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { DriverSelectedVehicleDto, FleetDriverDto, FleetDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverExpandedFiltersComponent } from '@ui/modules/drivers/features/driver-details/components/driver-expanded-filters/driver-expanded-filters.component';
import { DriverHistoryComponent } from '@ui/modules/drivers/features/driver-details/components/driver-history/driver-history.component';
import { DriverOrdersComponent } from '@ui/modules/drivers/features/driver-details/components/driver-orders/driver-orders.component';
import { DriverPhotosComponent } from '@ui/modules/drivers/features/driver-details/components/driver-photos/driver-photos.component';
import { DriverRestrictionComponent } from '@ui/modules/drivers/features/driver-details/components/driver-restriction/driver-restriction.component';
import { DriverStatisticsContainerComponent } from '@ui/modules/drivers/features/driver-details/containers';
import { DriverVehicleAccessComponent } from '@ui/modules/drivers/features/driver-vehicle-access/driver-vehicle-access.component';
import { NamedFragmentsDirective, NAMED_FRAGMENTS } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';

@Component({
  selector: 'upf-driver-details-tabs',
  standalone: true,
  imports: [
    DriverPhotosComponent,
    MatTab,
    TranslateModule,
    MatTabContent,
    MatTabLabel,
    DriverVehicleAccessComponent,
    MatTabGroup,
    LetDirective,
    DriverStatisticsContainerComponent,
    AsyncPipe,
    DriverExpandedFiltersComponent,
    DriverRestrictionComponent,
    DriverHistoryComponent,
    DriverOrdersComponent,
  ],
  templateUrl: './driver-details-tabs.component.html',
  styleUrls: ['./driver-details-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['statistics', 'access', 'photos', 'filters', 'restrictions', 'history', 'trips'],
    },
  ],
})
export class DriverDetailsTabsComponent extends NamedFragmentsDirective {
  @Input() public selectedFleet: FleetDto;
  @Input() public selectedVehicle: DriverSelectedVehicleDto;
  @Input() public selectedDriver: FleetDriverDto;
  @Input() public isDriverBlocked: boolean;
  @Input() public isMobileView = false;
}
