import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoutePointDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-map-route',
  standalone: true,
  imports: [TranslateModule, MatIcon],
  templateUrl: './map-route.component.html',
  styleUrls: ['./map-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRouteComponent {
  @Input() public routePoints: RoutePointDto[];
}
