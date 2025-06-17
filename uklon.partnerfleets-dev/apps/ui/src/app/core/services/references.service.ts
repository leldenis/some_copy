import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CountryPhoneFormatDto,
  DictionariesListDto,
  DictionaryCollectionDto,
  ModelsDictionaryDto,
  RegionDictionaryItemDto,
  VehicleOptionDictionaryItemDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { FleetRegion } from '@ui/shared/enums/fleet-regions.enum';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ReferencesService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getAllDictionaries(): Observable<DictionariesListDto> {
    return this.http.get<DictionariesListDto>('api/dictionaries');
  }

  public getRegions(): Observable<DictionaryCollectionDto<RegionDictionaryItemDto>> {
    return this.http.get<DictionaryCollectionDto<RegionDictionaryItemDto>>('api/dictionaries/regions');
  }

  public getVehicleModels(makeId: string): Observable<DictionaryCollectionDto<ModelsDictionaryDto>> {
    return this.http.get<DictionaryCollectionDto<ModelsDictionaryDto>>('api/dictionaries/models', {
      params: { make_id: makeId },
    });
  }

  public getCountriesPhoneFormats(): Observable<DictionaryCollectionDto<CountryPhoneFormatDto>> {
    return this.http.get<DictionaryCollectionDto<CountryPhoneFormatDto>>('api/dictionaries/country-phone-formats');
  }

  public getOptionsByRegion(
    regionId: FleetRegion | string = '',
  ): Observable<DictionaryCollectionDto<VehicleOptionDictionaryItemDto>> {
    const params = new HttpParams({ fromObject: { regionId } });

    return this.http
      .get<DictionaryCollectionDto<VehicleOptionDictionaryItemDto>>('api/dictionaries/options', { params })
      .pipe(
        map((options) => {
          return { items: options.items.filter(({ is_driver_editable }) => is_driver_editable) };
        }),
      );
  }
}
