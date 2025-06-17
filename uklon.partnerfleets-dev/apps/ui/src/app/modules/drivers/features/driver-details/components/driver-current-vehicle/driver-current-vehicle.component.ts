import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { DriverSelectedVehicleDto, PictureUrlDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { UklAngularCoreModule } from '@uklon/angular-core';

@Component({
  selector: 'upf-driver-current-vehicle',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    TranslateModule,
    NgxTippyModule,
    RouterLink,
    UklAngularCoreModule,
    DefaultImgSrcDirective,
  ],
  templateUrl: './driver-current-vehicle.component.html',
  styleUrl: './driver-current-vehicle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverCurrentVehicleComponent {
  @Input() public vehicleAvatar: PictureUrlDto | null;
  @Input() public selected_vehicle?: DriverSelectedVehicleDto;
  @Input() public unlinkBlocked: boolean;
  @Output() public unlinkVehicle = new EventEmitter<void>();

  public readonly vehicleDetailsPath = `/${CorePaths.WORKSPACE}/${CorePaths.VEHICLES}/${VehiclePaths.DETAILS}`;
}
