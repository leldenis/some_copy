import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translateItems',
  standalone: true,
})
export class TranslateItemsPipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  public transform(values: string[], translateKey: string): string {
    return values.map((item) => this.translateService.instant(`${translateKey}${item}`)).join(', ');
  }
}
