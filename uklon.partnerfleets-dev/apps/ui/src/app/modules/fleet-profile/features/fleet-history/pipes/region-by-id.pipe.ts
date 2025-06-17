import { Pipe, PipeTransform } from '@angular/core';
import { RegionDto } from '@data-access';
import { Store } from '@ngrx/store';
import { ReferencesState } from '@ui/core/store/references/references.reducer';
import { getRegions } from '@ui/core/store/references/references.selectors';
import { Observable, map } from 'rxjs';

@Pipe({
  name: 'regionById',
  standalone: true,
})
export class RegionByIdPipe implements PipeTransform {
  private readonly regions$ = this.store.select(getRegions) as Observable<RegionDto[]>;

  constructor(private readonly store: Store<ReferencesState>) {}

  public transform(regionId: number): Observable<RegionDto> {
    return this.regions$.pipe(map((regions) => regions?.find(({ id }) => id === regionId)));
  }
}
