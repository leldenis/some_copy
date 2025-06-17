import { inject, Pipe, PipeTransform } from '@angular/core';
import { DriverOrderFilterDto, SectorTagDto } from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, startWith } from 'rxjs';
import { map } from 'rxjs/operators';

type ActivatedFilter = 'for_offer' | 'for_loop' | 'for_broadcast';
type ActivatedFilterTime = 'offer_enabled_at' | 'broadcast_enabled_at' | 'loop_enabled_at';

interface FilterDetails {
  time: number;
  typeKey: string;
  sourceSectors: string;
  destinationSectors: string;
}

const FILTER_TYPE: ActivatedFilter[] = ['for_offer', 'for_loop', 'for_broadcast'];
const ACTIVATED_FILTER_TIME_PROPERTY: Record<
  ActivatedFilter,
  {
    timeProperty: ActivatedFilterTime;
    typeKey: string;
  }
> = {
  for_offer: { timeProperty: 'offer_enabled_at', typeKey: 'DriverFilters.Short.Offer' },
  for_loop: { timeProperty: 'loop_enabled_at', typeKey: 'DriverFilters.Short.OfferLoopFilter' },
  for_broadcast: { timeProperty: 'broadcast_enabled_at', typeKey: 'DriverFilters.Short.Broadcast' },
} as const;

function getSectorsNames(tags: SectorTagDto[][], locale: string): string {
  const names = tags.reduce<string[]>((acc, val): string[] => {
    const defaultName = val.find(({ name }) => name === 'name')?.value;
    const sectorName = val.find(({ name }) => name.includes(`:${locale}`))?.value;
    return [...acc, sectorName ?? defaultName];
  }, []);

  return names.join(', ');
}

@Pipe({
  name: 'driverOrderFilter',
  standalone: true,
})
export class DriverOrderFilterPipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);

  public transform(value: DriverOrderFilterDto): Observable<FilterDetails> {
    const filterType = FILTER_TYPE.find((type) => !!value[type]);

    if (!filterType) return of(null);

    return this.translateService.onLangChange.pipe(
      startWith({ lang: this.translateService.currentLang }),
      map(({ lang }) => {
        const sourceSectors = getSectorsNames(value.filters.include_source_sectors.sectors_tags, lang);
        const destinationSectors = getSectorsNames(value.filters.include_destination_sectors.sectors_tags, lang);
        const { timeProperty, typeKey } = ACTIVATED_FILTER_TIME_PROPERTY[filterType];

        return { time: value[timeProperty], typeKey, sourceSectors, destinationSectors };
      }),
    );
  }
}
