import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { BodyType, VehicleAccessType } from '@constant';
import { FleetVehicleCashierPosDto, PictureUrlDto, VehicleDetailsDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import * as driversSelectors from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { FLEET_VEHICLE_BODY_TYPE_INTL, FLEET_VEHICLE_COLOR_INTL } from '@ui/modules/vehicles/consts';
import { VehicleCashPointInfoComponent } from '@ui/modules/vehicles/features/vehicle-details/components/vehicle-cash-point-info/vehicle-cash-point-info.component';
import { NormalizeStringPipe, StatusBadgeComponent, StatusColor } from '@ui/shared';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { TranslateLoadCapacityPipe } from '@ui/shared/modules/vehicle-shared/pipes/load-capacity/translate-load-capacity.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { ICONS } from '@ui/shared/tokens';
import { filter, map } from 'rxjs';

@Component({
  selector: 'upf-vehicle-details-info',
  standalone: true,
  imports: [
    TranslateModule,
    TranslateLoadCapacityPipe,
    NormalizeStringPipe,
    Seconds2DatePipe,
    StatusBadgeComponent,
    VehicleCashPointInfoComponent,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    DefaultImgSrcDirective,
    AsyncPipe,
    RouterLink,
    MatButton,
    MatMenuItem,
  ],
  templateUrl: './vehicle-details-info.component.html',
  styleUrls: ['./vehicle-details-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailsInfoComponent {
  @ViewChild(MatMenu)
  public menu: MatMenu;

  @Input() public vehicle: VehicleDetailsDto;
  @Input() public accessType: VehicleAccessType;
  @Input() public isVehicleBlocked: boolean;
  @Input({ required: true }) public rroAvailable: boolean;
  @Input() public vehicleCashPoint: FleetVehicleCashierPosDto;

  @Output() public delete = new EventEmitter<void>();
  @Output() public unlink = new EventEmitter<{ id: string; placeholder: string }>();
  @Output() public unlinkCashPoint = new EventEmitter<FleetVehicleCashierPosDto>();

  public readonly bodyTypeIntl = FLEET_VEHICLE_BODY_TYPE_INTL;
  public readonly colorIntl = FLEET_VEHICLE_COLOR_INTL;
  public readonly vehicleCargoType = BodyType.CARGO;
  public readonly accessColorMap: Record<string, StatusColor> = {
    [VehicleAccessType.ALL]: 'success',
    [VehicleAccessType.SPECIFIC_DRIVERS]: 'primary',
    [VehicleAccessType.NOBODY]: 'warn',
  };
  public readonly corePaths = CorePaths;
  public readonly driverPaths = DriverPaths;

  public readonly icons = inject(ICONS);
  public readonly store = inject(Store);
  public readonly sanitizer = inject(DomSanitizer);

  public avatar$ = this.store.select(driversSelectors.getFleetDriverAvatar).pipe(
    filter((avatar: PictureUrlDto) => !!avatar),
    map((avatar: PictureUrlDto) => {
      return {
        fallback_url: this.sanitizer.bypassSecurityTrustUrl(avatar.fallback_url),
        url: this.sanitizer.bypassSecurityTrustUrl(avatar.url),
      };
    }),
  );

  public handleDeleteVehicleClick(): void {
    this.delete.emit();
  }

  public handleUnlinkClick(vehicleDetails: VehicleDetailsDto): void {
    this.unlink.emit({
      id: vehicleDetails.id,
      placeholder: `${vehicleDetails.selected_by_driver?.last_name} ${vehicleDetails.selected_by_driver?.first_name}`,
    });
  }
}
