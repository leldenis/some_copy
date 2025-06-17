import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BonusBrandingProgramNameDto,
  BrandingBonusCalculationPeriodDto,
  BrandingBonusProgramCalculationDto,
  BrandingCalculationsProgramDto,
  CollectionDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

import { Region } from '@uklon/types';

@Injectable({ providedIn: 'root' })
export class BonusService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getBrandingProgramNames(regionId: Region): Observable<BonusBrandingProgramNameDto[]> {
    return this.http.get<BonusBrandingProgramNameDto[]>('api/bonuses/branding-program-names', {
      params: { regionId },
    });
  }

  public getBrandingCalculationPeriods(
    fleetId: string,
    programId: string,
  ): Observable<BrandingBonusCalculationPeriodDto[]> {
    return this.http.get<BrandingBonusCalculationPeriodDto[]>(`api/bonuses/branding-periods`, {
      params: { fleet_id: fleetId, program_id: programId },
    });
  }

  public getBrandingProgramDetails(calculationId: string): Observable<BrandingCalculationsProgramDto> {
    return this.http.get<BrandingCalculationsProgramDto>(
      `api/bonuses/branding/calculations/${calculationId}/program-details`,
    );
  }

  public getBrandingProgramsCalculations(
    calculationId: string,
    fleetId: string,
    vehicleId?: string,
  ): Observable<CollectionDto<BrandingBonusProgramCalculationDto>> {
    return this.http.get<CollectionDto<BrandingBonusProgramCalculationDto>>(
      `api/bonuses/branding-programs/calculations/${calculationId}`,
      {
        params: { fleet_id: fleetId, vehicle_id: vehicleId ?? '' },
      },
    );
  }
}
