import { Pipe, PipeTransform } from '@angular/core';
import { cleanGuid } from '@ui/shared/utils/clean-guid';

@Pipe({
  name: 'id2Color',
  standalone: true,
})
export class Id2ColorPipe implements PipeTransform {
  private readonly darkBackColors = [
    '#E2844F',
    '#B54450',
    '#C933A8',
    '#9D1FD1',
    '#5358BC',
    '#2179B8',
    '#159670',
    '#4EAB37',
    '#E2B103',
  ];
  private readonly darkForeColor = '#FFFFFF';

  public transform(id: string): { back: string; fore: string } {
    const normalizedId = cleanGuid(id);
    const charsSum = [...normalizedId].reduce((result, char) => result + char.charCodeAt(0), 0);

    return {
      back: this.darkBackColors[charsSum % this.darkBackColors.length],
      fore: this.darkForeColor,
    };
  }
}
