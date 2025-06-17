import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'karmaBarWidth',
  standalone: true,
})
export class KarmaBarWidthPipe implements PipeTransform {
  public transform(karma: number, index: number, numOfSections = 4): number {
    const sectionStep = 100 / numOfSections;
    const currentSection = index * sectionStep;

    if (currentSection <= karma) {
      return 100;
    }

    if (currentSection - karma < sectionStep) {
      return ((karma % sectionStep) / sectionStep) * 100;
    }

    return 0;
  }
}
