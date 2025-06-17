import { Pipe, PipeTransform } from '@angular/core';
import { DriverFilter } from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable, startWith } from 'rxjs';

const FILTERS_MAP = {
  [DriverFilter.CHAIN]: 'DriverFilters.Chain',
  [DriverFilter.FAST_SEARCH]: 'DriverFilters.Chain',
  [DriverFilter.HOME_FILTER]: 'DriverFilters.Chain',
  [DriverFilter.OFFER]: 'DriverFilters.Offer',
  [DriverFilter.BROADCAST]: 'DriverFilters.Broadcast',
  [DriverFilter.LOOP_FILTER]: 'DriverFilters.OfferLoopFilter',
};
const FILTERS_TO_COMBINE = new Set([DriverFilter.OFFER, DriverFilter.BROADCAST, DriverFilter.LOOP_FILTER]);
const NO_LINK_FILTER_KEY = new Set([FILTERS_MAP[DriverFilter.CHAIN], 'DriverFilters.Short.Broadcast']);

@Pipe({
  name: 'driverFilters',
  standalone: true,
})
export class DriverFiltersPipe implements PipeTransform {
  constructor(private readonly translateService: TranslateService) {}

  public transform(
    driverFilters: DriverFilter[] | undefined,
    isOnline = false,
  ): Observable<
    {
      key: string;
      data: string;
      isLink: boolean;
    }[]
  > {
    return this.translateService.onLangChange.pipe(
      startWith({ lang: this.translateService.currentLang }),
      map(() => {
        if (!driverFilters?.length) {
          const noFiltersKey = isOnline ? 'DriverFilters.Short.Broadcast' : 'DriverFilters.NoFilters';
          return [{ key: noFiltersKey, isLink: false, data: null }];
        }

        const activeFiltersKeys: string[] = [];
        const combinedFilters: DriverFilter[] = [];

        let filters = [...driverFilters];

        filters.forEach((filter) => {
          if (FILTERS_TO_COMBINE.has(filter)) {
            combinedFilters.push(filter);
          }
        });

        if (combinedFilters.length > 1) {
          activeFiltersKeys.push('DriverFilters.CombinedFilters');
          filters = filters.filter((filter) => !FILTERS_TO_COMBINE.has(filter));
        }

        const uniqueFiltersKeys: string[] = [...new Set(filters.map((filter) => FILTERS_MAP[filter]))];

        if (isOnline) {
          uniqueFiltersKeys.push('DriverFilters.Short.Broadcast');
        }

        return [...activeFiltersKeys, ...uniqueFiltersKeys].map((filterKey) => {
          const combined =
            combinedFilters.length > 1
              ? combinedFilters
                  .map((filter) => {
                    try {
                      return this.translateService.instant(`DriverFilters.Short.${filter}`);
                    } catch {
                      return '';
                    }
                  })
                  .join(', ')
              : null;

          return {
            key: filterKey,
            data: combined,
            isLink: !NO_LINK_FILTER_KEY.has(filterKey),
          };
        });
      }),
    );
  }
}
