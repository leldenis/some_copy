import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';

@Component({
  selector: 'upf-vehicle-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vehicle-link.component.html',
  styleUrl: './vehicle-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleLinkComponent {
  public readonly vehicleId = input<string>();
  public readonly licensePlate = input<string>();
  public readonly make = input<string>();
  public readonly model = input<string>();

  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
}
