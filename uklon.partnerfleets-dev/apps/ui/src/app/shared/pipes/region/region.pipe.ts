import { Pipe, PipeTransform } from '@angular/core';
import { DictionaryDto } from '@data-access';
import { Store } from '@ngrx/store';
import { ReferencesState } from '@ui/core/store/references/references.reducer';
import * as referencesSelectors from '@ui/core/store/references/references.selectors';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Pipe({
  name: 'region',
  standalone: true,
})
export class RegionPipe implements PipeTransform {
  public regions$ = this.referencesStore
    .select(referencesSelectors.getRegions)
    .pipe(filter((regions: DictionaryDto[]) => !!regions));

  constructor(private readonly referencesStore: Store<ReferencesState>) {}

  public transform(regionId: number): Observable<string> {
    if (typeof regionId !== 'number') return of('');

    return this.regions$.pipe(
      map((regions: DictionaryDto[]) => {
        const region = regions?.find(({ id }) => id === regionId);

        return region?.code ?? '';
      }),
    );
  }
}
