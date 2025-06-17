import { DefaultController } from '@api/common';
import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { RemoveReasonEntity } from '@api/common/entities/remove-reason.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { VehicleDetailsEntity } from '@api/controllers/vehicles/entities/vehicle-details.entitiy';
import { VehicleProductConfigurationCollectionEntity } from '@api/controllers/vehicles/entities/vehicle-product-configuration-collection.entity';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { BlockedListStatusValue, BodyType, PhotoSize } from '@constant';
import {
  FleetVehicleCollectionDto,
  FleetVehicleCollectionQueryDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  VehicleAccessSettingsDto,
  VehicleAccessSettingUpdateItemDto,
  VehicleBasicInfoCollection,
  VehicleBasicInfoDto,
  VehicleDetailsDto,
  VehicleHistoryChangeItemDto,
  VehicleHistoryChangesDto,
  VehicleHistoryType,
  VehicleProductConfigurationCollectionDto,
} from '@data-access';
import {
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { FleetVehicleBasicInfoEntity, FleetVehicleCollectionEntity, VehicleHistoryChangeItemEntity } from './entities';

@DefaultController('/fleets/:fleetId/vehicles', 'Fleet vehicles')
@UseGuards(AuthGuard)
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({
    exposeUnsetFields: false,
  })
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles' }]))
  @ApiQuery({ name: 'licencePlate', required: false, type: String })
  @ApiQuery({ name: 'hasBranding', required: false, type: Boolean })
  @ApiQuery({ name: 'hasPriority', required: false, type: Boolean })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'bodyType', required: false, type: String, enum: BodyType })
  @ApiQuery({ name: 'status', required: false, type: String, enum: BlockedListStatusValue })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetVehicleCollectionEntity })
  public getFleetVehicles(
    @Param('fleetId') fleetId: string,
    @Query() queryParams: FleetVehicleCollectionQueryDto,
    @UserToken() token: Jwt,
  ): Observable<FleetVehicleCollectionDto> {
    return this.vehicleService.getFleetVehiclesV2(token, fleetId, queryParams);
  }

  @Post('/:vehicleId/release')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{0}/vehicles/{1}/:release' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public releaseFleetVehicleById(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.vehicleService.releaseFleetVehicleById(token, fleetId, vehicleId);
  }

  @Get('/:vehicleId/product-configurations')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/vehicles/{1}/product-configurations' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleProductConfigurationCollectionEntity })
  public getFleetVehicleProductConfigurations(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleProductConfigurationCollectionDto> {
    return this.vehicleService.getFleetVehicleProductConfigurations(token, fleetId, vehicleId);
  }

  @Put('/:vehicleId/product-configurations')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/vehicles/{1}/product-configurations' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateFleetVehicleProductConfigurations(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
    @Body() body: ProductConfigurationUpdateItemCollectionDto,
  ): Observable<void> {
    return this.vehicleService.updateFleetVehicleProductConfigurations(token, fleetId, vehicleId, body);
  }

  @Get('/:vehicleId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles/{1}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleDetailsEntity })
  public getFleetVehicleById(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleDetailsDto> {
    return this.vehicleService.getFleetVehicleById(token, fleetId, vehicleId);
  }

  @Delete('/:vehicleId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/vehicles/{1}' }]))
  @ApiBody({ type: RemoveReasonEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteFleetVehicleById(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() body: RemoveReasonDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.vehicleService.deleteFleetVehicleById(token, fleetId, vehicleId, body);
  }

  @Get('/:vehicleId/images')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/{0}/images' }]))
  @ApiQuery({ name: 'image_size', enum: PhotoSize })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PhotosEntity })
  public getFleetVehiclePhotos(
    @Param('vehicleId') vehicleId: string,
    @Query('image_size') image_size: PhotoSize,
    @UserToken() token: Jwt,
  ): Observable<PhotosDto> {
    return this.vehicleService.getFleetVehiclePhotos(token, vehicleId, image_size);
  }

  @Get('/:vehicleId/access-to-drivers')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/vehicles/{1}/access-to-drivers' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleProductConfigurationCollectionEntity })
  public getFleetVehicleAccessSettings(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleAccessSettingsDto> {
    return this.vehicleService.getFleetVehicleAccessSettings(token, fleetId, vehicleId);
  }

  @Put('/:vehicleId/access-to-all-drivers')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/vehicles/{1}/access-to-all-drivers' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public grantFleetVehicleAccessToAllDrivers(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
    @Body() body: object,
  ): Observable<void> {
    return this.vehicleService.grantFleetVehicleAccessToAllDrivers(token, fleetId, vehicleId, body);
  }

  @Put('/:vehicleId/access-to-drivers')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/fleets/{0}/vehicles/{1}/access-to-drivers' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public grantFleetVehicleAccessToSpecificDrivers(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
    @Body() body: VehicleAccessSettingUpdateItemDto,
  ): Observable<void> {
    return this.vehicleService.grantFleetVehicleAccessToSpecificDrivers(token, fleetId, vehicleId, body);
  }

  @Delete('/:vehicleId/access-to-all-drivers')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'DELETE', url: 'api/v1/fleets/{0}/vehicles/{1}/access-to-all-drivers' },
    ]),
  )
  @ApiBody({ type: RemoveReasonEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public removeFleetVehicleAccessFromAllDrivers(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() body: Pick<RemoveReasonDto, 'comment'>,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.vehicleService.removeFleetVehicleAccessFromAllDrivers(token, fleetId, vehicleId, body);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:vehicleId/changes-history')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/{0}/changes-history' }]))
  @CursorCollectionOkResponse(VehicleHistoryChangeItemEntity)
  public getFleetDriverHistory(
    @Param('vehicleId') vehicleId: string,
    @Query('limit') limit: number,
    @Query('cursor') cursor: string,
    @Query('fleetId') fleetId: string,
    @Query('changeType') changeType: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleHistoryChangesDto> {
    return this.vehicleService.getFleetVehicleHistory(token, vehicleId, fleetId, changeType, { limit, cursor });
  }

  @Get('/:vehicleId/changes-history/:changeType/:eventId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/{0}/changes-history/{1}/{2}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleHistoryChangeItemEntity })
  public getFleetDriverHistoryChangeInfo(
    @Param('vehicleId') vehicleId: string,
    @Param('changeType') changeType: VehicleHistoryType,
    @Param('eventId') eventId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleHistoryChangeItemDto> {
    return this.vehicleService.getFleetVehicleHistoryChangeInfo(token, vehicleId, changeType, eventId);
  }

  @Get('/:vehicleId/license-plate')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/vehicles/basic-info' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetVehicleBasicInfoEntity })
  public getFleetVehicleBasicInfo(
    @Param('vehicleId') vehicleId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleBasicInfoDto> {
    return this.vehicleService.getFleetVehicleBasicInfo(token, [vehicleId]).pipe(
      map((collection: VehicleBasicInfoCollection) => collection?.items || []),
      map(([license]) => license),
    );
  }
}
