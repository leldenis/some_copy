import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FleetDto, VehicleDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleAccessComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-access/vehicle-access.component';
import { VehicleHistoryComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-history/vehicle-history.component';
import { VehicleOrdersComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-orders/vehicle-orders.component';
import { VehiclePhotosComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-photos/vehicle-photos.component';
import { VehicleProductsComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-products/vehicle-products.component';
import { NamedFragmentsDirective, NAMED_FRAGMENTS, MAT_TAB_IMPORTS } from '@ui/shared';

@Component({
  selector: 'upf-vehicle-details-tabs',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    AsyncPipe,
    TranslateModule,
    VehicleProductsComponent,
    VehicleAccessComponent,
    VehicleHistoryComponent,
    VehiclePhotosComponent,
    VehicleOrdersComponent,
  ],
  templateUrl: './vehicle-details-tabs.component.html',
  styleUrls: ['./vehicle-details-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['products', 'access', 'history', 'photos', 'trips'],
    },
  ],
})
export class VehicleDetailsTabsComponent extends NamedFragmentsDirective {
  @Input() public fleet: FleetDto;
  @Input() public vehicle: VehicleDetailsDto;
  @Input() public isVehicleBlocked: boolean;
  @Input() public isMobileView = false;
}
