import { Pipe, PipeTransform } from '@angular/core';
import { FleetOrderRecordRouteDto } from '@data-access';

@Pipe({
  name: 'routeTooltip',
  standalone: true,
})
export class RouteTooltipPipe implements PipeTransform {
  public transform(route: FleetOrderRecordRouteDto): string {
    const li = route.points.map((point) => `<li>● ${point.address}</li>`);
    return `<ul>${li.join('')}</ul>`;
  }
}
