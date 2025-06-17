import { Pipe, PipeTransform } from '@angular/core';

const SIGNS_AMOUNT = 4;

@Pipe({
  name: 'keyMask',
  standalone: true,
})
export class KeyMaskPipe implements PipeTransform {
  public transform(value: string): string {
    if (!value) {
      return '';
    }

    if (value.length <= SIGNS_AMOUNT + SIGNS_AMOUNT) {
      return value;
    }

    const firstPart = value.slice(0, SIGNS_AMOUNT);
    const lastPart = value.slice(-SIGNS_AMOUNT);
    return `${firstPart}...${lastPart}`;
  }
}
