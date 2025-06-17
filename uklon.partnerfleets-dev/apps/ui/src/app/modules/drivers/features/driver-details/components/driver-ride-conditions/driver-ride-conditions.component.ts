import { NgTemplateOutlet, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DriverRideConditionDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-driver-ride-conditions',
  standalone: true,
  imports: [TitleCasePipe, TranslateModule, NgTemplateOutlet],
  templateUrl: './driver-ride-conditions.component.html',
  styleUrl: './driver-ride-conditions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverRideConditionsComponent {
  @Input() public set rideConditions(conditions: DriverRideConditionDto[]) {
    this.driverRideConditionOn = conditions.filter((i) => i?.is_available);
    this.driverRideConditionOff = conditions.filter((i) => !i?.is_available);
  }

  public driverRideConditionOn: DriverRideConditionDto[] = [];
  public driverRideConditionOff: DriverRideConditionDto[] = [];
}
