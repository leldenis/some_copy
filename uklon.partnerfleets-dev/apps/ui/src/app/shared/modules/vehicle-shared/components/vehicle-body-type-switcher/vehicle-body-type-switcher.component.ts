import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { BodyType } from '@constant';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-vehicle-body-type-switcher',
  standalone: true,
  imports: [MatButtonToggleGroup, MatButtonToggle, TranslateModule],
  templateUrl: './vehicle-body-type-switcher.component.html',
  styleUrls: ['./vehicle-body-type-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBodyTypeSwitcherComponent {
  @Input() public selectedBodyType: BodyType = null;
  @Input() public disabled = false;

  @Output() public changeBodyType = new EventEmitter<BodyType>();

  public readonly bodyType = BodyType;
  public readonly options = [
    {
      value: null,
      label: 'Vehicles.Creation.TransportType.Passenger',
    },
    {
      value: BodyType.CARGO,
      label: 'Vehicles.Creation.TransportType.Cargo',
    },
  ];

  public change(value: BodyType | null): void {
    this.changeBodyType.emit(value);
  }
}
