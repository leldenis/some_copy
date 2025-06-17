import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PartnersService } from '@api/datasource/partners.service';
import {
  CountryPhoneFormatDto,
  DictionaryCollectionDto,
  DictionaryDto,
  MakesDictionaryDto,
  ModelsDictionaryDto,
  DictionariesListDto,
  RegionDictionaryItemDto,
  Language,
  VehicleOptionDictionaryItemDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class DictionariesService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getRegionsDictionary(): Observable<DictionaryCollectionDto<RegionDictionaryItemDto>> {
    return this.partnersService
      .get<DictionaryCollectionDto<RegionDictionaryItemDto>>('api/v1/dictionaries/regions')
      .pipe(
        map((response) => {
          const items = response?.items?.map(({ locale_settings, ...rest }) => {
            return {
              ...rest,
              locale_settings: {
                allowed: locale_settings?.allowed?.map((item) => item.toLowerCase() as Language),
                default: locale_settings?.default.toLowerCase() as Language,
              },
            };
          });

          return { items };
        }),
      );
  }

  public getColorsDictionary(token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.partnersService.get<DictionaryCollectionDto<DictionaryDto>>('api/v1/dictionaries/colors', { token });
  }

  public getBodyTypesDictionary(token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.partnersService.get<DictionaryCollectionDto<DictionaryDto>>('api/v1/dictionaries/body-types', {
      token,
    });
  }

  public getComfortLevelsDictionary(token: Jwt): Observable<DictionaryCollectionDto<DictionaryDto>> {
    return this.partnersService.get<DictionaryCollectionDto<DictionaryDto>>('api/v1/dictionaries/comfort-levels', {
      token,
    });
  }

  public getOptionsDictionary(
    token: Jwt,
    regionId: number = null,
  ): Observable<DictionaryCollectionDto<VehicleOptionDictionaryItemDto>> {
    const params = regionId ? { 'region-id': regionId } : {};

    return this.partnersService.get<DictionaryCollectionDto<VehicleOptionDictionaryItemDto>>(
      'api/v1/dictionaries/options',
      {
        token,
        params,
      },
    );
  }

  public getVehicleMakesDictionary(token: Jwt): Observable<DictionaryCollectionDto<MakesDictionaryDto>> {
    return this.partnersService.get<DictionaryCollectionDto<MakesDictionaryDto>>('api/v1/vehicles/makes', { token });
  }

  public getVehicleModelsDictionary(
    token: Jwt,
    make_id: string,
  ): Observable<DictionaryCollectionDto<ModelsDictionaryDto>> {
    return this.partnersService.get<DictionaryCollectionDto<ModelsDictionaryDto>>('api/v1/vehicles/models', {
      token,
      params: { make_id },
    });
  }

  public getCountriesPhoneFormats(): Observable<DictionaryCollectionDto<CountryPhoneFormatDto>> {
    return this.partnersService.get('api/v1/dictionaries/country-phone-formats');
  }

  public getAllDictionaries(token: Jwt): Observable<DictionariesListDto> {
    return combineLatest([
      this.getRegionsDictionary(),
      this.getColorsDictionary(token),
      this.getBodyTypesDictionary(token),
      this.getComfortLevelsDictionary(token),
      this.getOptionsDictionary(token),
      this.getVehicleMakesDictionary(token),
    ]).pipe(
      map(([regions, colors, body_types, comfort_levels, options, makes]) => ({
        regions: regions.items,
        colors: colors.items,
        body_types: body_types.items,
        comfort_levels: comfort_levels.items,
        options: options.items,
        makes: makes.items,
        years: this.getIssueYears(),
      })),
    );
  }

  public getIssueYears(): number[] {
    const yearNow = new Date().getFullYear();
    const yearStart = 1990;

    return Array.from(Array.from({ length: yearNow - yearStart + 1 }), (_, x) => yearNow - x);
  }
}
