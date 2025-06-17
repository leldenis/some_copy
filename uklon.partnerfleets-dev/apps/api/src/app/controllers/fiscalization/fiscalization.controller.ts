import { ApiErrorResponseEntity } from '@api/common/entities';
import { FleetAccessGuard } from '@api/common/guards';
import { handleEmptyResponse } from '@api/common/utils/handler-empty-response';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import {
  FleetCashPointEntity,
  FleetFiscalizationSettingsEntity,
  FleetFiscalizationStatusEntity,
  FleetSignatureKeyEntity,
  FleetSignatureKeyIdEntity,
} from '@api/controllers/fiscalization/entities';
import { GatewayFleetCashPointEntity } from '@api/controllers/fiscalization/entities/gateway-fleet-cash-point.entity';
import { FiscalService } from '@api/controllers/fiscalization/fiscal.service';
import {
  FleetCashPointCollection,
  FleetCashPointDto,
  FleetFiscalizationSettingsDto,
  FleetFiscalizationStatusDto,
  FleetSignatureKeyDto,
  FleetSignatureKeyIdDto,
  FleetSignatureKeysCollection,
  FleetUploadSignatureKeysDto,
  FleetVehicleCashierPosDto,
  FleetVehicleCollectionQueryDto,
  FleetVehicleFiscalizationCollectionDto,
  FleetVehiclePointOfSaleDto,
  GatewayFleetCashPointCollection,
} from '@data-access';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import FormData from 'form-data';
import { map, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

@ApiTags('Fleet fiscalization')
@Controller('/fiscalization')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
export class FiscalizationController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Get('/:fleetId/settings')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(
    buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/fleets/{0}/fiscalization/settings' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetFiscalizationSettingsEntity })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  public getFleetFiscalizationSettings(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Res() res: Response,
  ): Observable<FleetFiscalizationSettingsDto | void> {
    return this.fiscalService.getFleetFiscalizationSettings(token, fleetId).pipe(
      map(handleEmptyResponse(res)),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  @Put('/:fleetId/settings')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(
    buildApiOperationOptions([{ service: 'F', method: 'PUT', url: 'api/v1/fleets/{0}/fiscalization/settings' }]),
  )
  @ApiBody({ type: FleetFiscalizationSettingsEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetFiscalizationSettings(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Body() body: FleetFiscalizationSettingsDto,
  ): Observable<void> {
    return this.fiscalService.updateFleetFiscalizationSettings(token, fleetId, body);
  }

  @Get('/:fleetId/status')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(
    buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/fleets/{0}/fiscalization/status' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetFiscalizationStatusEntity })
  public getFleetFiscalizationStatus(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Res() res: Response,
  ): Observable<FleetFiscalizationStatusDto | void> {
    return this.fiscalService.getFleetFiscalizationStatus(token, fleetId).pipe(
      map(handleEmptyResponse(res)),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  @Put('/:fleetId/status')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(
    buildApiOperationOptions([{ service: 'F', method: 'PUT', url: 'api/v1/fleets/{0}/fiscalization/status' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetFiscalizationStatus(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Body() body: FleetFiscalizationStatusDto,
  ): Observable<void> {
    return this.fiscalService.updateFleetFiscalizationStatus(token, fleetId, body);
  }

  @Post('/:fleetId/signature-keys')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'POST', url: 'api/v1/fleets/{0}/signature-keys' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetSignatureKeyIdEntity })
  public uploadSignatureKeys(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FleetUploadSignatureKeysDto,
  ): Observable<FleetSignatureKeyIdDto> {
    if (!file) {
      throw new Error('File not found');
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('password', body.password);
    formData.append('display_name', body.display_name);

    return this.fiscalService.uploadFleetSignatureKeys(token, fleetId, formData);
  }

  @Get('/:fleetId/signature-keys')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/fleets/{fleetId}/signature-keys' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetSignatureKeyEntity, isArray: true })
  public getFleetSignatureKeys(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
  ): Observable<FleetSignatureKeysCollection> {
    return this.fiscalService.getFleetSignatureKeys(token, fleetId);
  }

  @Get('/signature-keys/:keyId')
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/signature-keys/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetSignatureKeyEntity })
  public getSignatureKeyById(@UserToken() token: Jwt, @Param('keyId') keyId: string): Observable<FleetSignatureKeyDto> {
    return this.fiscalService.getFleetSignatureKeyById(token, keyId);
  }

  @Delete('/signature-keys/:keyId')
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'DELETE', url: 'api/v1/signature-keys/{0}' }]))
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  public removeSignatureKey(@UserToken() token: Jwt, @Param('keyId') keyId: string): Observable<void> {
    return this.fiscalService.removeFleetSignatureKey(token, keyId);
  }

  @Get('/:fleetId/cashiers/:cashierId/pos')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/tax-agency/cashiers/{0}/pos' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: GatewayFleetCashPointEntity, isArray: true })
  public getFleetCashiersPos(
    @UserToken() token: Jwt,
    @Param('cashierId') cashierId: string,
  ): Observable<GatewayFleetCashPointCollection> {
    return this.fiscalService.getFleetCashiersPos(token, cashierId);
  }

  @Get('/:fleetId/points-of-sale')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'GET', url: 'api/v1/pos' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetCashPointEntity, isArray: true })
  public getFleetPointsOfSale(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
  ): Observable<FleetCashPointCollection> {
    return this.fiscalService.getFleetPointsOfSale(token, fleetId);
  }

  @Post('/cashiers/:cashierId/pos')
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'POST', url: 'api/v1/cashiers/{0}/pos' }]))
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  public linkCashierToKey(
    @UserToken() token: Jwt,
    @Param('cashierId') cashierId: string,
    @Body() body: FleetCashPointDto,
  ): Observable<void> {
    return this.fiscalService.linkCashierToKey(token, cashierId, body);
  }

  @Get('/:fleetId/vehicles')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles' },
      { service: 'F', method: 'GET', url: '/api/v1/pos' },
      { service: 'F', method: 'GET', url: '/api/v1/pos/{0}/shift-status' },
    ]),
  )
  @ApiQuery({ name: 'licencePlate', required: false, type: String })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetVehicles(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query() queryParams: FleetVehicleCollectionQueryDto,
  ): Observable<FleetVehicleFiscalizationCollectionDto> {
    return this.fiscalService.getFleetFiscalizationVehicles(token, fleetId, queryParams);
  }

  @Post('/vehicles/:vehicleId/pos')
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'POST', url: 'api/v1/vehicles/{0}/pos' }]))
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Created' })
  public linkCashierToVehicle(
    @UserToken() token: Jwt,
    @Param('vehicleId') vehicleId: string,
    @Body() body: FleetVehiclePointOfSaleDto,
  ): Observable<void> {
    return this.fiscalService.linkCashierToVehicle(token, vehicleId, body);
  }

  @Delete('/vehicles/:vehicleId/pos')
  @ApiOperation(buildApiOperationOptions([{ service: 'F', method: 'DELETE', url: '/api/v1/vehicles/{0}/pos' }]))
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No Content' })
  public removeCashierFromVehicle(@UserToken() token: Jwt, @Param('vehicleId') vehicleId: string): Observable<void> {
    return this.fiscalService.removeCashierFromVehicle(token, vehicleId);
  }

  @Get('/:fleetId/vehicles/:vehicleId/point-of-sale')
  @UseGuards(FleetAccessGuard)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'F', method: 'GET', url: '/api/v1/vehicles/{0}/pos' },
      { service: 'F', method: 'GET', url: '/api/v1/pos/{0}/shift-status' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetVehicleLinkedPointOfSale(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
  ): Observable<FleetVehicleCashierPosDto> {
    return this.fiscalService.getFleetVehiclePointOfSale(token, fleetId, vehicleId);
  }
}
