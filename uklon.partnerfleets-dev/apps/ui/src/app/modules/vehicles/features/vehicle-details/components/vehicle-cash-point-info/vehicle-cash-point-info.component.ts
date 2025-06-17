import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FleetCashPointStatus, FleetVehicleCashierPosDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StatusBadgeComponent } from '@ui/shared';

@Component({
  selector: 'upf-vehicle-cash-point-info',
  standalone: true,
  imports: [StatusBadgeComponent, TranslateModule, MatIcon, MatIconButton],
  templateUrl: './vehicle-cash-point-info.component.html',
  styleUrl: './vehicle-cash-point-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCashPointInfoComponent {
  @Input() public cashPoint: FleetVehicleCashierPosDto;

  @Output() public unlink = new EventEmitter<FleetVehicleCashierPosDto>();

  public readonly cashierStatus = FleetCashPointStatus;

  public get showCashPointAndUnlinkBtn(): boolean {
    return this.cashPoint?.id && this.cashPoint?.fiscalStatus && this.cashPoint?.status === this.cashierStatus.OPEN;
  }

  public unlinkCashPoint(): void {
    this.unlink.emit(this.cashPoint);
  }
}
