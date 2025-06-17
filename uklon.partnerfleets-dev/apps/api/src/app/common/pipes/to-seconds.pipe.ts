import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ToSecondsPipe implements PipeTransform {
  public transform(value: number): string {
    return (value / 1000).toFixed(0);
  }
}
