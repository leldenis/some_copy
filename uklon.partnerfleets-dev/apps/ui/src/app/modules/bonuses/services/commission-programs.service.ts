import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommissionProgramType } from '@constant';
import {
  CommissionProgramsCollectionDto,
  DriverCommissionProgramsQueryDto,
  VehiclesCommissionProgramsQueryDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommissionProgramsService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getDriverCommissionPrograms(
    query: DriverCommissionProgramsQueryDto,
    programType: CommissionProgramType,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.http.get<CommissionProgramsCollectionDto>(`api/bonuses/drivers/commission-programs/${programType}`, {
      params: { ...query },
    });
  }

  public getVehicleCommissionPrograms(
    query: VehiclesCommissionProgramsQueryDto,
    programType: CommissionProgramType,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.http.get<CommissionProgramsCollectionDto>(`api/bonuses/vehicles/commission-programs/${programType}`, {
      params: { ...query },
    });
  }
}
