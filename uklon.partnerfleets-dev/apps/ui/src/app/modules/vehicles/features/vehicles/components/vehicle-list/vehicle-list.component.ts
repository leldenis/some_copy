import { SelectionModel } from '@angular/cdk/collections';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { BlockedListStatusValue, BodyType, TicketStatus } from '@constant';
import { FleetVehicleDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { DriverPaths } from '@ui/modules/drivers/models/driver-paths';
import { VehicleBrandingPeriodIconComponent } from '@ui/modules/vehicles/features/vehicles/components/vehicle-branding-period-icon/vehicle-branding-period-icon.component';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { MAT_TABLE_IMPORTS, NormalizeStringPipe, PhotoControlIconComponent, StatusBadgeComponent } from '@ui/shared';
import { PaginationComponent } from '@ui/shared/components/pagination';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-vehicle-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    NgTemplateOutlet,
    RouterLink,
    MatIcon,
    NgxTippyModule,
    PhotoControlIconComponent,
    VehicleBrandingPeriodIconComponent,
    MatIconButton,
    NgClass,
    NormalizeStringPipe,
    StatusBadgeComponent,
    PaginationComponent,
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent implements OnChanges {
  @Input() public vehicles: FleetVehicleDto[];
  @Input() public totalCount: number;
  @Input() public selected: string;
  @Input() public brandingPeriodAvailable: boolean;

  @Output() public unlinkVehicle = new EventEmitter<FleetVehicleDto>();
  @Output() public readonly selectionChange = new EventEmitter<string>();

  public readonly icons = inject(ICONS);

  public readonly selection = new SelectionModel<number>();

  public columns = [
    'LicencePlate',
    'Toggle',
    'Vehicle',
    'Branding',
    'VehicleClass',
    'Priority',
    'Availability',
    'Driver',
    'ExpandedView',
  ];

  public readonly bodyType = BodyType;
  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly driverPath = DriverPaths;
  public readonly vehicleBlockedStatus = BlockedListStatusValue.BLOCKED;
  public readonly ticketStatus = TicketStatus;

  public ngOnChanges({ vehicles, selected }: SimpleChanges): void {
    if (vehicles && this.vehicles) {
      this.selection.clear();
    }

    if (selected && this.selected) {
      const index = this.vehicles.findIndex((vehicle) => vehicle.id === this.selected);
      if (index >= 0) {
        this.selection.select(index);
      } else {
        this.selection.clear();
      }
    } else {
      this.selection.clear();
    }
  }

  public unlink(event: Event, vehicle: FleetVehicleDto): void {
    event.stopPropagation();
    this.unlinkVehicle.emit(vehicle);
  }

  public toggle(value: number): void {
    this.selection.toggle(value);
    const vehicle = this.selection.isSelected(value) ? this.vehicles[value] : undefined;
    this.selectionChange.emit(vehicle?.id);
  }
}
