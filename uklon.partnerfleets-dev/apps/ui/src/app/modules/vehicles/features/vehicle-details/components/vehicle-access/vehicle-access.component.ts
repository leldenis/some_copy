import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { VehicleAccessType } from '@constant';
import { Driver, FleetDto, SelectedByDriverDto, VehicleAccessSettingsDto, VehicleDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { ToastService } from '@ui/core/services/toast.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { MAT_FORM_FIELD_IMPORTS } from '@ui/shared';
import { DriversSelectionAutocompleteComponent } from '@ui/shared/components/drivers-selection-autocomplete/drivers-selection-autocomplete.component';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { EMPTY, Observable, tap } from 'rxjs';

@Component({
  selector: 'upf-vehicle-access',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    AsyncPipe,
    TranslateModule,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    NgxTippyModule,
    DriversSelectionAutocompleteComponent,
    MatInput,
    CdkTextareaAutosize,
    MatButton,
  ],
  templateUrl: './vehicle-access.component.html',
  styleUrls: ['./vehicle-access.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleAccessComponent {
  @ViewChild(DriversSelectionAutocompleteComponent, { static: false })
  public autocomplete: DriversSelectionAutocompleteComponent;

  @Input() public fleet: FleetDto;
  @Input() public isVehicleBlocked: boolean;

  @Input() public set vehicle(vehicleDetails: VehicleDetailsDto) {
    this.resetDriversSelection(vehicleDetails);
    this.initVariables(vehicleDetails);
  }

  public currentDriver: Driver;
  public vehicleAccessType: typeof VehicleAccessType = VehicleAccessType;
  public filterControl = new FormControl<string>('');
  public commentControl = new FormControl<string>('');
  public accessControl = new FormControl<VehicleAccessType>(this.vehicleAccessType.ALL);
  public driverControl = new FormControl<Driver[]>([]);

  public settings$: Observable<VehicleAccessSettingsDto>;

  private vehicleDetails: VehicleDetailsDto;

  constructor(
    private readonly vehicleService: VehiclesService,
    private readonly toastService: ToastService,
  ) {}

  public get requestArgs(): [string, string] {
    return [this.fleet.id, this.vehicleDetails?.id];
  }

  public handleSettingsUpdate(): void {
    if (this.accessControl.value === this.vehicleAccessType.SPECIFIC_DRIVERS && this.driverControl.invalid) {
      this.autocomplete.markAsTouched();
      return;
    }

    this.getUpdateAccessRequest().subscribe(() => {
      this.toastService.success('Vehicles.VehicleAccess.UpdateAccessSuccess');
    });
  }

  private getCurrentDriver(driver: SelectedByDriverDto): Driver | null {
    return driver ? { ...driver, id: driver.driver_id } : null;
  }

  private resetDriversSelection(vehicleDetails: VehicleDetailsDto): void {
    this.currentDriver = this.getCurrentDriver(vehicleDetails.selected_by_driver);
    this.driverControl.reset(this.currentDriver ? [this.currentDriver] : []);
  }

  private initVariables(vehicleDetails: VehicleDetailsDto): void {
    this.vehicleDetails = vehicleDetails;

    this.settings$ = this.vehicleService.getFleetVehicleAccessSettings(...this.requestArgs).pipe(
      tap(({ access_type, drivers, comment }) => {
        const selectedDrivers = drivers.filter(({ id }) => id !== this.currentDriver?.id);

        this.accessControl.setValue(access_type || this.vehicleAccessType.ALL);
        this.commentControl.setValue(comment || '');
        this.driverControl.setValue([...this.driverControl.value, ...selectedDrivers]);
      }),
    );
  }

  private getUpdateAccessRequest(): Observable<void> {
    switch (this.accessControl.value) {
      case VehicleAccessType.ALL:
        return this.vehicleService
          .grantFleetVehicleAccessToAllDrivers(...this.requestArgs)
          .pipe(tap(() => this.driverControl.reset([])));

      case VehicleAccessType.SPECIFIC_DRIVERS:
        return this.vehicleService.grantFleetVehicleAccessToSpecificDrivers(...this.requestArgs, {
          type: 'Access',
          driver_ids: this.driverControl.value.map(({ id }) => id),
        });

      case VehicleAccessType.NOBODY:
        return this.vehicleService
          .removeFleetVehicleAccessFromAllDrivers(...this.requestArgs, { comment: this.commentControl.value })
          .pipe(tap(() => this.driverControl.reset([])));

      default:
        return EMPTY;
    }
  }
}
