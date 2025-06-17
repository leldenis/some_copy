import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { EmployeesLocationsEntity } from '@api/controllers/geolocation/entities/map-employee.entity';
import { Employee, LiveMapDataDto, LiveMapLocationDto, LocationPointDto, NearestLocationDto } from '@data-access';
import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { NearestLocationEntity } from './entities';
import { GeolocationService } from './geolocation.service';

const SEARCH_RADIUS_METERS = 500;

@ApiTags('Geolocation')
@Controller('/geolocation')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class GeolocationController {
  constructor(private readonly geoService: GeolocationService) {}

  @Get('/:fleetId/drivers')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/locations' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: EmployeesLocationsEntity })
  public getFleetDriversLocations(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<LiveMapDataDto> {
    return this.geoService.getFleetDriversLocations(token, fleetId);
  }

  @Get('/address')
  @ApiOperation(buildApiOperationOptions([{ service: 'S', method: 'GET', url: 'api/v1/addresses/nearest' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: NearestLocationEntity, isArray: true })
  public getAddressByGeolocation(
    @UserToken() token: Jwt,
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('locale') locale: string,
    @Query('radius') radius?: number,
    @Query('count') count?: number,
  ): Observable<NearestLocationDto[]> {
    return this.geoService.getAddressByGeolocation(
      latitude,
      longitude,
      locale,
      radius || SEARCH_RADIUS_METERS,
      count ?? 1,
      token,
    );
  }

  @Get('/by-region-id')
  @ApiOperation(buildApiOperationOptions([{ service: 'RS', method: 'GET', url: 'api/v1/cities/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Object })
  public getGeolocationByRegionId(
    @UserToken() token: Jwt,
    @Query('regionId') regionId: number,
  ): Observable<LiveMapLocationDto> {
    return this.geoService.getGeolocationByRegionId(regionId, token);
  }

  @Get('/employee/:employeeId/timeframe')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'GPSF', method: 'GET', url: 'api/v1/driver-track/{0}' },
      { service: 'GPSF', method: 'GET', url: 'api/v1/courier-track/{0}' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', isArray: true })
  public getDriverLocationsInTimeframe(
    @UserToken() token: Jwt,
    @Param('employeeId') employeeId: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('employeeType') employeeType: Employee,
  ): Observable<LocationPointDto[]> {
    return this.geoService.getEmployeeLocationsInTimeframe(employeeId, from, to, employeeType, token);
  }

  @Get('/:fleetId/couriers')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/finance-mediators/{0}/couriers/locations' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: EmployeesLocationsEntity })
  public getFleetCouriersLocations(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<LiveMapDataDto> {
    return this.geoService.getFleetCouriersLocations(token, fleetId);
  }
}
