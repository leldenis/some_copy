import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FleetDetailsDto, FleetType, RegionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-fleet-profile-info',
  standalone: true,
  templateUrl: './fleet-profile-info.component.html',
  styleUrls: ['./fleet-profile-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, Id2ColorPipe, NgOptimizedImage, Seconds2DatePipe],
})
export class FleetProfileInfoComponent {
  public readonly fleet = input.required<FleetDetailsDto>();
  public readonly region = input.required<RegionDto>();

  public readonly courierFleetTypes = new Set<FleetType>([
    FleetType.COURIER_FINANCE_MEDIATOR,
    FleetType.PRIVATE_COURIER,
  ]);
}
