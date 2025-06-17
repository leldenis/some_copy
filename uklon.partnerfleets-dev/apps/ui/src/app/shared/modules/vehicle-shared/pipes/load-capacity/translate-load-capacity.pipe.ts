import { Pipe, PipeTransform } from '@angular/core';
import { LoadCapacity } from '@constant';
import { TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 'translateLoadCapacity',
  pure: false,
  standalone: true,
})
export class TranslateLoadCapacityPipe extends TranslatePipe implements PipeTransform {
  public override transform(value: LoadCapacity, type?: 'desc' | 'full'): string {
    if (!value) {
      return '';
    }

    switch (type) {
      case 'full':
        return `
          ${super.transform(`Vehicles.LoadCapacity.Name.${value}`)} -
          ${super.transform(`Vehicles.LoadCapacity.Description.${value}`)}
        `;
      case 'desc':
        return super.transform(`Vehicles.LoadCapacity.Description.${value}`);
      default:
        return super.transform(`Vehicles.LoadCapacity.Name.${value}`);
    }
  }
}
