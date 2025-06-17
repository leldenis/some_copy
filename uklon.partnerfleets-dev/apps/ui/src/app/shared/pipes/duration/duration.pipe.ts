import { Pipe, PipeTransform } from '@angular/core';
import { transformFormatDuration } from '@ui/shared/utils/format-duration';

export interface DurationDate {
  hours?: string;
  minutes: string;
}

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  public transform(ms: number): DurationDate {
    return transformFormatDuration(ms);
  }
}
