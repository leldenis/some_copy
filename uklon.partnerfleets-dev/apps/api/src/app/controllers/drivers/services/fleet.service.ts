import { HttpControllerService } from '@api/common';
import { PartnersService } from '@api/datasource';
import { RegionDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const REGION_URL = 'api/v1/regions/{0}';

@Injectable()
export class FleetService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public getRegion(regionId: string, token: Jwt): Observable<RegionDto> {
    const url = this.buildUrl(REGION_URL, regionId);
    return this.partnersService.get<RegionDto>(url, { token });
  }
}
