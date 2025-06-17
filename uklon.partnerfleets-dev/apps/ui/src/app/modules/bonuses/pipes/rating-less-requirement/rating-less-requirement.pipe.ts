import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingLessRequirement',
  standalone: true,
})
export class RatingLessRequirementPipe implements PipeTransform {
  public transform(currentRating: number, ratingRequirement: number): boolean {
    return currentRating < ratingRequirement * 100;
  }
}
