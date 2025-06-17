import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {
  FleetCashPointStatus,
  FleetVehicleDto,
  FleetVehicleWithFiscalizationDto,
  FleetVehicleWithFiscalizationUnlinkDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { VEHICLE_FISCALIZATION_STATUS_COLOR } from '@ui/modules/fleet-profile/features/fleet-rro/models';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { StatusBadgeComponent, UIService } from '@ui/shared';
import { PaginationComponent } from '@ui/shared/components/pagination';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { Observable } from 'rxjs';

export interface LinkCashierToVehiclePayload {
  cashierId: string;
  vehicle: FleetVehicleDto;
  fleetId?: string;
}

@Component({
  selector: 'upf-fleet-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    LetDirective,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
    MatIconButton,
    StatusBadgeComponent,
    TranslateModule,
    RouterLink,
    PaginationComponent,
  ],
  templateUrl: './fleet-vehicle-list.component.html',
  styleUrl: './fleet-vehicle-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetVehicleListComponent {
  @Input({ required: true }) public vehicles: FleetVehicleWithFiscalizationDto[] = [];
  @Input({ required: true }) public totalCount: number;

  @Output() public openLinkCashToVehicleModal = new EventEmitter<LinkCashierToVehiclePayload>();
  @Output() public openUnLinkCashFromVehicleModal = new EventEmitter<FleetVehicleWithFiscalizationUnlinkDto>();

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly vehicleCashierStatus = VEHICLE_FISCALIZATION_STATUS_COLOR;
  public readonly cashierStatus = FleetCashPointStatus;

  constructor(private readonly uiService: UIService) {}

  public handlerOpenLinkCashToVehicleModal(cashierId: string, vehicle: FleetVehicleDto): void {
    this.openLinkCashToVehicleModal.emit({ cashierId, vehicle });
  }

  public unlinkCashier(event: MouseEvent, item: FleetVehicleWithFiscalizationDto): void {
    event.stopPropagation();
    const data: FleetVehicleWithFiscalizationUnlinkDto = {
      vehicle: {
        id: item.vehicle.id,
        name: `${item.vehicle.licencePlate} ${item.vehicle.about.maker.name} ${item.vehicle.about.model.name}`,
      },
      cashierPos: item.cashierPos,
    };
    this.openUnLinkCashFromVehicleModal.emit(data);
  }
}
