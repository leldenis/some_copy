import { CollectionOkResponse, DefaultController, InfinityScrollCollectionOkResponse } from '@api/common';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { BonusesService } from '@api/controllers/bonuses/bonuses.service';
import {
  BrandingBonusCalculationsProgramOldEntity,
  CommissionProgramsEntity,
  BrandingBonusCalculationPeriodOldEntity,
  BrandingBonusProgramOldEntity,
  BrandingBonusProgramNameEntity,
  BrandingBonusCalculationPeriodEntity,
  BrandingCalculationsProgramEntity,
  BrandingBonusCalculationEntity,
} from '@api/controllers/bonuses/entities';
import { CommissionProgramType } from '@constant';
import {
  BrandingBonusCalculationQueryOldDto,
  BrandingBonusCalculationPeriodsCollectionOld,
  BrandingBonusCalculationsProgramOldDto,
  BrandingBonusProgramsCollectionOld,
  DriverCommissionProgramsQueryDto,
  CommissionProgramsCollectionDto,
  VehiclesCommissionProgramsQueryDto,
  BonusBrandingProgramNameDto,
  BrandingBonusCalculationPeriodDto,
  BrandingCalculationsProgramDto,
  CollectionDto,
  BrandingBonusProgramCalculationDto,
} from '@data-access';
import { Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

@DefaultController('/bonuses', 'Bonuses')
@UseGuards(AuthGuard)
export class BonusesController {
  constructor(private readonly bonusesService: BonusesService) {}

  @Get('/branding-program-names')
  @ApiOperation(buildApiOperationOptions([{ service: 'DB', method: 'GET', url: 'api/v1/branding-bonus-programs' }]))
  @ApiQuery({ name: 'regionId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: [BrandingBonusProgramNameEntity] })
  public getBrandingProgramNames(
    @UserToken() token: Jwt,
    @Query('regionId') regionId: number,
  ): Observable<BonusBrandingProgramNameDto[]> {
    return this.bonusesService.getBrandingProgramNames(token, regionId);
  }

  @Get('/branding-periods')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/branding-bonus-programs/calculations/periods' },
    ]),
  )
  @ApiQuery({ name: 'fleet_id', type: String })
  @ApiQuery({ name: 'program_id', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: BrandingBonusCalculationPeriodEntity })
  public getBrandingBonusCalculationPeriods(
    @UserToken() token: Jwt,
    @Query('fleet_id') fleetId: string,
    @Query('program_id') programId: string,
  ): Observable<BrandingBonusCalculationPeriodDto[]> {
    return this.bonusesService.getBrandingBonusCalculationPeriods(token, fleetId, programId);
  }

  @Get('/branding/calculations/:calculationId/program-details')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/branding-bonus-programs/calculations/{0}/program' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: BrandingCalculationsProgramEntity })
  public getBrandingBonusProgramDetailsByCalculationId(
    @UserToken() token: Jwt,
    @Param('calculationId') calculationId: string,
  ): Observable<BrandingCalculationsProgramDto> {
    return this.bonusesService.getBrandingBonusProgramDetailsByCalculationId(token, calculationId);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/branding-programs/calculations/:calculationId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/branding-bonus-programs/calculations/{calculationId}' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v1/drivers/basic-info' },
    ]),
  )
  @ApiQuery({ name: 'fleet_id', type: String })
  @ApiQuery({ name: 'vehicle_id', type: String, required: false })
  @CollectionOkResponse(BrandingBonusCalculationEntity)
  public getBrandingBonusProgramsCalculations(
    @UserToken() token: Jwt,
    @Param('calculationId') calculationId: string,
    @Query('fleet_id') fleetId: string,
    @Query('vehicle_id') vehicleId: string,
  ): Observable<CollectionDto<BrandingBonusProgramCalculationDto>> {
    return this.bonusesService.getBrandingBonusProgramCalculations(token, calculationId, fleetId, vehicleId);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/branding-calculation-periods')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'DB', method: 'GET', url: 'api/v1/branding-calculation-periods' }]),
  )
  @ApiQuery({ name: 'wallet_id', type: String })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @InfinityScrollCollectionOkResponse(BrandingBonusCalculationPeriodOldEntity)
  public getBrandingBonusCalculationPeriodsOld(
    @UserToken() token: Jwt,
    @Query() query: BrandingBonusCalculationQueryOldDto,
  ): Observable<BrandingBonusCalculationPeriodsCollectionOld> {
    return this.bonusesService.getBrandingBonusCalculationPeriodsOld(token, query);
  }

  @Get('/branding-calculations-program')
  @ApiOperation(buildApiOperationOptions([{ service: 'DB', method: 'GET', url: 'api/v1/calculations/{0}/program' }]))
  @ApiQuery({ name: 'calculation_id', type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: BrandingBonusCalculationsProgramOldEntity })
  public getBrandingBonusCalculationsProgramOld(
    @UserToken() token: Jwt,
    @Query('calculation_id') calculationId: string,
  ): Observable<BrandingBonusCalculationsProgramOldDto> {
    return this.bonusesService.getBrandingBonusCalculationsProgramOld(token, calculationId);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:calculationId/branding-programs')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/branding-calculations/{0}/items' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v1/drivers/basic-info' },
    ]),
  )
  @ApiQuery({ name: 'calculation_id', type: String })
  @ApiQuery({ name: 'wallet_id', type: String })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'vehicle_id', type: String, required: false })
  @InfinityScrollCollectionOkResponse(BrandingBonusProgramOldEntity)
  public getBrandingBonusProgramsOld(
    @UserToken() token: Jwt,
    @Param('calculationId') calculationId: string,
    @Query() query: BrandingBonusCalculationQueryOldDto,
  ): Observable<BrandingBonusProgramsCollectionOld> {
    return this.bonusesService.getBrandingBonusProgramsOld(token, calculationId, query);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/drivers/commission-programs/:programType')
  @ApiParam({
    name: 'programType',
    enum: CommissionProgramType,
    required: true,
  })
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/active' },
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/planned' },
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/archived' },
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/basic-info' },
    ]),
  )
  @ApiQuery({ name: 'fleet_id', type: String })
  @ApiQuery({ name: 'driver_id', type: String, required: false })
  @ApiQuery({ name: 'region_id', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'offset', type: Number })
  @InfinityScrollCollectionOkResponse(CommissionProgramsEntity)
  public getDriversCommissionPrograms(
    @UserToken() token: Jwt,
    @Param('programType') programType: CommissionProgramType,
    @Query() query: DriverCommissionProgramsQueryDto,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.bonusesService.getDriversCommissionPrograms(token, programType, query);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/vehicles/commission-programs/:programType')
  @ApiParam({
    name: 'programType',
    enum: CommissionProgramType,
    required: true,
  })
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/active' },
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/planned' },
      { service: 'DB', method: 'GET', url: 'api/v1/commission-programs/participants/archived' },
      { service: 'P', method: 'GET', url: '/api/v1/vehicles/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/drivers/basic-info' },
    ]),
  )
  @ApiQuery({ name: 'fleet_id', type: String })
  @ApiQuery({ name: 'vehicle_id', type: String, required: false })
  @ApiQuery({ name: 'region_id', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiQuery({ name: 'offset', type: Number })
  @InfinityScrollCollectionOkResponse(CommissionProgramsEntity)
  public getVehiclesCommissionPrograms(
    @UserToken() token: Jwt,
    @Param('programType') programType: CommissionProgramType,
    @Query() query: VehiclesCommissionProgramsQueryDto,
  ): Observable<CommissionProgramsCollectionDto> {
    return this.bonusesService.getVehiclesCommissionPrograms(token, programType, query);
  }
}
