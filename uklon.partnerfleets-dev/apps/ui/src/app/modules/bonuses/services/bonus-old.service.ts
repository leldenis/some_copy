import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BrandingBonusCalculationQueryOldDto,
  BrandingBonusCalculationPeriodsCollectionOld,
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsCollectionOld,
  BrandingBonusCalculationPeriodOldDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { toClientDate, toServerDate } from '@uklon/angular-core';

@Injectable({ providedIn: 'root' })
export class BonusOldService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getBrandingBonusCalculationPeriods(
    query: BrandingBonusCalculationQueryOldDto,
  ): Observable<BrandingBonusCalculationPeriodsCollectionOld> {
    return this.http
      .get<BrandingBonusCalculationPeriodsCollectionOld>(`api/bonuses/branding-calculation-periods`, {
        params: { ...query },
      })
      .pipe(
        map((collection: BrandingBonusCalculationPeriodsCollectionOld) => {
          const grouped = this.groupDataByUniquePeriods(collection.items);
          return { ...collection, items: grouped };
        }),
      );
  }

  public getBrandingBonusCalculationsProgram(
    calculationId: string,
  ): Observable<BrandingBonusCalculationsProgramOldDto> {
    return this.http.get<BrandingBonusCalculationsProgramOldDto>(`api/bonuses/branding-calculations-program`, {
      params: { calculation_id: calculationId },
    });
  }

  public getBrandingBonusPrograms(
    query: BrandingBonusCalculationQueryOldDto,
    calculationId: string,
  ): Observable<BrandingBonusProgramsCollectionOld> {
    return this.http.get<BrandingBonusProgramsCollectionOld>(`api/bonuses/${calculationId}/branding-programs`, {
      params: { ...query },
    });
  }

  private convertDateWithoutTime(timestamp: number): number {
    const date = toClientDate(timestamp);
    date.setHours(0, 0, 0, 0);
    return toServerDate(date);
  }

  private groupDataByUniquePeriods(
    items: BrandingBonusCalculationPeriodOldDto[],
  ): BrandingBonusCalculationPeriodOldDto[] {
    const grouped = new Map<string, Partial<BrandingBonusCalculationPeriodOldDto>>();

    items.forEach((item) => {
      const startDay = this.convertDateWithoutTime(item.period.range[0]);
      const endDay = this.convertDateWithoutTime(item.period.range[1]);
      const rangeKey = `${startDay}-${endDay}`;

      let group: Partial<BrandingBonusCalculationPeriodOldDto> = grouped.get(rangeKey);
      if (!group) {
        group = {
          ...item,
          period: { range: [startDay, endDay] },
          brandingTypes: [],
        };
        grouped.set(rangeKey, group);
      }

      const brandingType = {
        calculation_id: item.calculation_id,
        types: [...item.branding_types],
      };

      if (item.branding_types.length > 0) {
        group.brandingTypes.push(brandingType);
      } else {
        group.calculation_id = item.calculation_id;
        group.brandingTypes.unshift(brandingType);
      }
    });

    return [...grouped.values()] as BrandingBonusCalculationPeriodOldDto[];
  }
}
