import { Pipe, PipeTransform } from '@angular/core';

const START_PAN_INDEX = 2;
const END_PAN_INDEX = -4;

@Pipe({
  name: 'cardPan',
  standalone: true,
})
export class CardPanPipe implements PipeTransform {
  public transform(value: string, addStartPan?: boolean): string {
    if (!value) return ' ';

    const [start, end] = [value.slice(0, START_PAN_INDEX), value.slice(END_PAN_INDEX)];
    return `${addStartPan ? start : '**'}** **** **** ${end}`;
  }
}
