import { Pipe, PipeTransform } from '@angular/core';

interface FullNameDto {
  first_name?: string;
  last_name?: string;
}

@Pipe({
  name: 'fullName',
  standalone: true,
})
export class FullNamePipe implements PipeTransform {
  public transform<T extends FullNameDto>(value: T, abbreviation = false): string {
    if (abbreviation) {
      return `${value?.last_name?.slice(0, 1)} ${value?.first_name?.slice(0, 1)}`;
    }

    return `${value?.last_name ?? ''} ${value?.first_name ?? ''}`;
  }
}
