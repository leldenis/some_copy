import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { DriverVehicleAccessType } from '@constant';
import {
  Driver,
  DriverSelectedVehicleDto,
  DriverVehicleAccessSettingsDto,
  FleetDriverDto,
  FleetDto,
  FleetVehicleDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { ToastService } from '@ui/core/services/toast.service';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { EMPTY, Observable, tap } from 'rxjs';

import { VehiclesAutocompleteComponent } from './components/vehicles-autocomplete/vehicles-autocomplete.component';

@Component({
  selector: 'upf-driver-vehicle-access',
  standalone: true,
  imports: [
    TranslateModule,
    AsyncPipe,
    MatRadioGroup,
    ReactiveFormsModule,
    MatRadioButton,
    NgxTippyModule,
    VehiclesAutocompleteComponent,
    MatButton,
  ],
  templateUrl: './driver-vehicle-access.component.html',
  styleUrls: ['./driver-vehicle-access.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverVehicleAccessComponent {
  @ViewChild(VehiclesAutocompleteComponent, { static: false })
  public autocomplete: VehiclesAutocompleteComponent;

  @Input() public fleet: FleetDto;
  @Input() public isDriverBlocked: boolean;

  @Input() public set driver(driverDetails: FleetDriverDto) {
    if (this.driverDetails?.id === driverDetails.id) return;

    this.resetVehicleSelection(driverDetails as unknown as Driver);
    this.initVariables(driverDetails);
  }

  public currentVehicle: FleetVehicleDto;
  public accessType = DriverVehicleAccessType;
  public filterControl = new FormControl<string>('');
  public accessControl = new FormControl<DriverVehicleAccessType>(this.accessType.ALL);
  public vehicleControl = new FormControl<FleetVehicleDto[]>([]);

  public settings$: Observable<DriverVehicleAccessSettingsDto>;

  private driverDetails: FleetDriverDto;

  constructor(
    private readonly toastService: ToastService,
    private readonly driverService: DriverService,
  ) {}

  public get requestArgs(): [string, string] {
    return [this.fleet.id, this.driverDetails?.id];
  }

  public handleSettingsUpdate(): void {
    if (this.accessControl.value === this.accessType.SPECIFIC_VEHICLES && this.vehicleControl.invalid) {
      this.autocomplete.markAsTouched();
      return;
    }

    this.getUpdateAccessRequest().subscribe(() => {
      this.toastService.success('Vehicles.DriverAccess.UpdateAccessSuccess');
    });
  }

  private getCurrentVehicle(vehicle: DriverSelectedVehicleDto): FleetVehicleDto | null {
    return vehicle ? ({ id: vehicle.vehicle_id, licencePlate: vehicle.license_plate } as FleetVehicleDto) : null;
  }

  private resetVehicleSelection(driver: Driver): void {
    this.currentVehicle = this.getCurrentVehicle(driver.selected_vehicle);
    this.vehicleControl.reset(this.currentVehicle ? [this.currentVehicle] : []);
  }

  private initVariables(driver: FleetDriverDto): void {
    this.driverDetails = driver;

    this.settings$ = this.driverService.getFleetDriverAccessSettings(...this.requestArgs).pipe(
      tap(({ access_type, vehicles }) => {
        const selectedVehicles = vehicles.filter(({ id }) => id !== this.currentVehicle?.id);

        this.accessControl.setValue(access_type || this.accessType.ALL);
        this.vehicleControl.setValue([...this.vehicleControl.value, ...selectedVehicles]);
      }),
    );
  }

  private getUpdateAccessRequest(): Observable<void> {
    switch (this.accessControl.value) {
      case DriverVehicleAccessType.ALL:
        return this.driverService
          .grantFleetDriverAccessToAllVehicles(...this.requestArgs)
          .pipe(tap(() => this.vehicleControl.reset([])));

      case DriverVehicleAccessType.SPECIFIC_VEHICLES:
        return this.driverService.grantFleetDriverAccessToSpecificVehicles(...this.requestArgs, {
          type: 'Access',
          vehicle_ids: this.vehicleControl.value.map(({ id }) => id),
        });

      case DriverVehicleAccessType.NOBODY:
        return this.driverService
          .removeFleetDriverAccessFromAllVehicles(...this.requestArgs)
          .pipe(tap(() => this.vehicleControl.reset([])));

      default:
        return EMPTY;
    }
  }
}
