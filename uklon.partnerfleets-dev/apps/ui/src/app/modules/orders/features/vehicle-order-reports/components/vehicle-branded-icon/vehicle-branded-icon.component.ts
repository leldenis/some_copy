import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

interface VehicleOptions {
  tooltip: string;
  tooltipDesc: string;
  icon: string;
}

enum VehicleBrandedType {
  BRANDED,
  PRIORITY,
  BRANDED_WITH_PRIORITY,
}

const VEHICLE_OPTIONS_INTL = new Map<VehicleBrandedType, VehicleOptions>([
  [
    VehicleBrandedType.BRANDED,
    {
      tooltip: 'VehicleOrderReportList.LicencePlace.Tooltip.Branded.Text',
      tooltipDesc: 'VehicleOrderReportList.LicencePlace.Tooltip.Branded.Description',
      icon: 'i-branded',
    },
  ],
  [
    VehicleBrandedType.PRIORITY,
    {
      tooltip: 'VehicleOrderReportList.LicencePlace.Tooltip.Priority.Text',
      tooltipDesc: 'VehicleOrderReportList.LicencePlace.Tooltip.Priority.Description',
      icon: 'i-priority',
    },
  ],
  [
    VehicleBrandedType.BRANDED_WITH_PRIORITY,
    {
      tooltip: 'VehicleOrderReportList.LicencePlace.Tooltip.BrandedWithPriority.Text',
      tooltipDesc: 'VehicleOrderReportList.LicencePlace.Tooltip.BrandedWithPriority.Description',
      icon: 'i-branded-with-priority',
    },
  ],
]);

@Component({
  selector: 'upf-vehicle-branded-icon',
  standalone: true,
  imports: [MatIconModule, TranslateModule, NgxTippyModule],
  templateUrl: './vehicle-branded-icon.component.html',
  styleUrls: ['./vehicle-branded-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandedIconComponent {
  @Input() public isBrandedWithPriority: boolean;
  @Input() public isBranded: boolean;
  @Input() public isPriority: boolean;
  @Input() public brandedDays: number;
  @Input() public priorityDays: number;
  @Input() public showTooltips = true;

  public readonly vehicleOptionsType = VehicleBrandedType;
  public readonly vehicleOptionsTooltip: Map<VehicleBrandedType, VehicleOptions> = VEHICLE_OPTIONS_INTL;
}
