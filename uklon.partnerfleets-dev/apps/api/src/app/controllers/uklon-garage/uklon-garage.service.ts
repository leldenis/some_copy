import { HttpControllerService } from '@api/common/http/http-controller.service';
import { PartnersService } from '@api/datasource';
import {
  CollectionCursorDto,
  CursorPageRequestDto,
  UklonGarageApplicationDto,
  UklonGarageApplicationStatus,
  UklonGarageFleetApplicationDto,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { isNil, omitBy } from 'lodash';
import { Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

@Injectable()
export class UklonGarageService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getApplications(
    token: Jwt,
    fleetId: string,
    { limit, cursor }: CursorPageRequestDto,
    { phone, status }: { phone: string; status: UklonGarageApplicationStatus },
  ): Observable<CollectionCursorDto<UklonGarageFleetApplicationDto>> {
    const params = omitBy({ limit, cursor, phone, statuses: status }, (value) => isNil(value) || value === '');

    return this.partnersService.get(`api/v1/fleets/${fleetId}/applies`, {
      token,
      params,
      paramsSerializer: { serialize: this.paramsSerializer },
    });
  }

  public applyForJob(fleetId: string, applicationId: string, body: UklonGarageApplicationDto): Observable<void> {
    return this.partnersService.post(`api/v1/fleets/${fleetId}/applies/${applicationId}`, body);
  }

  public approveApplication(applicationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/applies/${applicationId}/:approve`, {}, { token });
  }

  public rejectApplication(applicationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/applies/${applicationId}/:reject`, {}, { token });
  }

  public reviewApplication(applicationId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/applies/${applicationId}/:review`, {}, { token });
  }
}
