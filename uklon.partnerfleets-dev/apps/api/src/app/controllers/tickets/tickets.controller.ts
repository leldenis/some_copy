import { DefaultController } from '@api/common';
import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import {
  TicketVehicleOptionsEntity,
  VehicleBrandingPeriodTicketEntity,
  VehicleBrandingPeriodTicketItemEntity,
  VehicleBrandingPeriodTicketQueryParamsEntity,
  VehicleTicketConfigEntity,
  VehicleTicketEntity,
} from '@api/controllers/tickets/entities';
import { AddVehicleTicketEntity } from '@api/controllers/tickets/entities/add-vehiclet-ticket.entity';
import { VehiclePhotoControlTicketsQueryParamsEntity } from '@api/controllers/tickets/entities/photo-control-tickets-query-params.entity';
import { TicketEntity } from '@api/controllers/tickets/entities/ticket.entity';
import { VehicleTicketCreationEntity } from '@api/controllers/tickets/entities/vehicle-ticket-creation.entitiy';
import { VehicleTicketUpdateEntity } from '@api/controllers/tickets/entities/vehicle-ticket-update.entitiy';
import { TicketsService } from '@api/controllers/tickets/tickets.service';
import { PhotoSize, TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import {
  AddVehicleTicketDto,
  CollectionCursorDto,
  PaginationCollectionDto,
  PhotosDto,
  TicketDto,
  UploadFileUrlDto,
  VehiclePhotoControlTicketDto,
  VehiclePhotoControlTicketItemDto,
  VehicleBrandingPeriodTicketQueryParamsDto,
  VehicleTicketConfigDto,
  VehicleTicketCreationDto,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
  VehicleBrandingPeriodTicketItemDto,
  VehicleVideoCategory,
  VehicleBrandingPeriodTicketDto,
  FleetVehicleOption,
} from '@data-access';
import { HttpService } from '@nestjs/axios';
import {
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { lastValueFrom, Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { VehiclePhotoControlTicketEntity } from './entities/vehicle-ticket.entity';

@DefaultController('/tickets', 'Tickets')
@UseGuards(AuthGuard)
export class TicketsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly ticketsService: TicketsService,
  ) {}

  /**
   * @deprecated The method should not be used
   */
  @Put('/:ticketId/images')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-additions/{0}/images/{1}/upload-url' },
      { service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-photo-control/{0}/images/{1}/upload-url' },
    ]),
  )
  @ApiQuery({ name: 'vehicle_picture_type', enum: VehiclePhotosCategory })
  @ApiQuery({ name: 'content_length', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: String })
  public async putVehicleTicketImage(
    @Param('ticketId') ticketId: string,
    @Query('category') category: VehiclePhotosCategory,
    @Query('ticketType') ticketType: TicketType,
    @UploadedFile() file: Express.Multer.File,
    @UserToken() token: Jwt,
  ): Promise<UploadFileUrlDto> {
    const fileSize = file.size;
    const outputBuffer: Buffer | ArrayBuffer = file.buffer;

    const uploadConfig = await lastValueFrom(
      this.ticketsService.getVehicleTicketImageUrl(token, ticketId, category, fileSize, ticketType),
    );

    await lastValueFrom(this.httpService.put(uploadConfig.uploadUrl, outputBuffer));

    return uploadConfig;
  }

  @Get('/:ticketId/images')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-additions/{0}/images' }]),
  )
  @ApiQuery({ name: 'image_size', enum: PhotoSize })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PhotosEntity })
  public getVehicleTicketImage(
    @Param('ticketId') ticketId: string,
    @Query('image_size') image_size: PhotoSize,
    @UserToken() token: Jwt,
  ): Observable<PhotosDto> {
    return this.ticketsService.getVehicleTicketImage(token, ticketId, image_size);
  }

  @Get('/fleets/:fleetId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/vehicle-addition-tickets' }]),
  )
  @ApiQuery({ name: 'license_plate', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: TicketStatus })
  @ApiQuery({ name: 'offset', type: Number })
  @ApiQuery({ name: 'limit', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: PhotosEntity })
  public getFleetVehiclesTickets(
    @Param('fleetId') fleetId: string,
    @Query('license_plate') license_plate: string,
    @Query('status') status: TicketStatus,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @UserToken() token: Jwt,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    return this.ticketsService.getVehicleTickets(
      token,
      fleetId,
      license_plate,
      status === TicketStatus.ALL ? null : status,
      offset,
      limit,
    );
  }

  @Get('/vehicle-addition/fleets/:fleetId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/vehicle-addition-tickets' }]),
  )
  @ApiQuery({ name: 'licensePlate', required: false, type: String })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleTicketEntity })
  public getVehicleAdditionTicketByLicensePlate(
    @Param('fleetId') fleetId: string,
    @Query('licensePlate') license_plate: string,
    @UserToken() token: Jwt,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    return this.ticketsService.getVehicleAdditionTicketByLicensePlate(token, fleetId, license_plate);
  }

  @Post('/fleets/:fleetId/vehicles/:vehicleId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/fleets/{0}/vehicles/{1}' }]))
  @ApiBody({ type: VehicleTicketCreationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public postFleetVehicleById(
    @Param('fleetId') fleetId: string,
    @Param('vehicleId') vehicleId: string,
    @Body() body: VehicleTicketCreationDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.ticketsService.postFleetVehicleById(token, fleetId, vehicleId, body);
  }

  @Get('/vehicle-additions/:ticketId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-additions/{0}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: AddVehicleTicketEntity })
  public getVehicleCreationTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<AddVehicleTicketDto> {
    return this.ticketsService.getVehicleCreationTicket(token, ticketId);
  }

  @Put('/vehicle-additions/:ticketId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/tickets/vehicle-additions/{0}' }]),
  )
  @ApiBody({ type: VehicleTicketUpdateEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateVehicleCreationTicket(
    @Param('ticketId') ticketId: string,
    @Body() body: VehicleTicketUpdateDto,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.ticketsService.updateVehicleCreationTicket(token, body, ticketId);
  }

  @Put('/vehicle-additions/review-awaiters')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PUT', url: 'api/v1/tickets/vehicle-additions/review-awaiters' },
    ]),
  )
  @ApiBody({ type: TicketEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public setVehicleCreationTicketSentSttus(@Body() body: TicketDto, @UserToken() token: Jwt): Observable<void> {
    return this.ticketsService.setVehicleCreationTicketSentStatus(token, body);
  }

  @Delete('/:ticketId')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'DELETE', url: 'api/v1/tickets/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public deleteTicket(@Param('ticketId') ticketId: string, @UserToken() token: Jwt): Observable<void> {
    return this.ticketsService.deleteTicket(token, ticketId);
  }

  @Get('/vehicle-photo-control/:ticketId')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-photo-control/{0}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehiclePhotoControlTicketEntity })
  public getVehiclePhotoControlTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<VehiclePhotoControlTicketDto> {
    return this.ticketsService.getVehiclePhotoControlTicket(token, ticketId);
  }

  @Get('/fleets/:fleetId/vehicles/vehicle-photo-control')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/vehicles/photo-control' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetVehiclesPhotoControlTickets(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query() query: VehiclePhotoControlTicketsQueryParamsEntity,
  ): Observable<CollectionCursorDto<VehiclePhotoControlTicketItemDto>> {
    return this.ticketsService.getFleetVehiclesPhotoControlTickets(token, fleetId, query);
  }

  @Post('/vehicle-photo-control/:ticketId/:send')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/tickets/vehicle-photo-control/{0}/:send' }]),
  )
  @ApiBody({ type: Object })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public sendVehiclePhotoControlTicket(@Param('ticketId') ticketId: string, @UserToken() token: Jwt): Observable<void> {
    return this.ticketsService.sendVehiclePhotoControlTicket(token, ticketId);
  }

  @Patch('/vehicle-photo-control/:ticketId')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'PATCH', url: 'api/v1/tickets/vehicle-photo-control/{ticket-id}' },
    ]),
  )
  @ApiBody({ type: TicketVehicleOptionsEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public updateVehiclePhotoControlTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
    @Body() body: { options: FleetVehicleOption[] },
  ): Observable<void> {
    return this.ticketsService.updateVehiclePhotoControlTicket(token, ticketId, body);
  }

  @Get('/fleets/:fleetId/vehicles/vehicle-photo-control/has-active-tickets')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/vehicles/photo-control' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public getFleetActivePhotoControlExist(
    @Param('fleetId') fleetId: string,
    @UserToken() token: Jwt,
  ): Observable<{ has_active_tickets: boolean }> {
    return this.ticketsService.getFleetActivePhotoControlExist(fleetId, token);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/fleets/:fleetId/vehicles/branding-periods')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/fleets/{0}/tickets/vehicles/branding-period' },
    ]),
  )
  @ApiQuery({ type: VehicleBrandingPeriodTicketQueryParamsEntity })
  @CursorCollectionOkResponse(VehicleBrandingPeriodTicketItemEntity)
  public getFleetVehiclesBrandingPeriodTickets(
    @UserToken() token: Jwt,
    @Param('fleetId') fleetId: string,
    @Query() query: VehicleBrandingPeriodTicketQueryParamsDto,
  ): Observable<CollectionCursorDto<VehicleBrandingPeriodTicketItemDto>> {
    return this.ticketsService.getFleetVehiclesBrandingPeriodTickets(token, fleetId, query);
  }

  @Get('/vehicle-brandings/monthly-code')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-brandings/monthly-code' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: String })
  public getFleetVehicleBrandingsMonthlyCode(@UserToken() token: Jwt): Observable<string> {
    return this.ticketsService.getFleetVehicleBrandingsMonthlyCode(token);
  }

  @Get('/:ticketId/vehicle-branding')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: '/api/v1/tickets/vehicle-brandings/{ticketId}' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleBrandingPeriodTicketEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public getVehicleBrandingPeriodTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleBrandingPeriodTicketDto> {
    return this.ticketsService.getVehicleBrandingPeriodTicket(ticketId, token);
  }

  @Post('/:ticketId/vehicle-branding/send')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: '/api/v1/tickets/vehicle-brandings/{ticketId}/:send' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public sendVehicleBrandingPeriodTicket(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.ticketsService.sendVehicleBrandingPeriodTicket(ticketId, token);
  }

  @Get('/:ticketId/configuration')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/{ticketId}/configuration' }]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleTicketConfigEntity })
  public getTicketConfig(
    @Param('ticketId') ticketId: string,
    @UserToken() token: Jwt,
  ): Observable<VehicleTicketConfigDto> {
    return this.ticketsService.getTicketConfig(ticketId, token);
  }

  @Get('/configuration')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/tickets/{region_id}/configuration' }]),
  )
  @ApiQuery({ name: 'regionId', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: VehicleTicketConfigEntity })
  public getTicketConfigByRegionId(
    @UserToken() token: Jwt,
    @Query('regionId') regionId: number,
  ): Observable<VehicleTicketConfigDto> {
    return this.ticketsService.getTicketConfigByRegionId(token, regionId);
  }

  @Get('/:ticketId/image-upload-url')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v1/tickets/vehicle-additions/{ticketId}/images/{category}/upload-url' },
      {
        service: 'P',
        method: 'GET',
        url: 'api/v1/tickets/vehicle-photo-control/{ticketId}/images/{category}/upload-url',
      },
      {
        service: 'P',
        method: 'GET',
        url: '/api/v1/tickets/driver-photo-control/{ticket-id}/images/{category}/upload-url',
      },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public getVehicleTicketUploadUrl(
    @Param('ticketId') ticketId: string,
    @Query('category') category: VehiclePhotosCategory,
    @Query('ticketType') ticketType: TicketType,
    @Query('fileSize') fileSize: number,
    @UserToken() token: Jwt,
  ): Observable<UploadFileUrlDto> {
    return this.ticketsService.getVehicleTicketUploadUrl(token, ticketId, category, Number(fileSize), ticketType);
  }

  @Get('/:ticketId/video-upload-url')
  @ApiOperation(
    buildApiOperationOptions([
      {
        service: 'P',
        method: 'GET',
        url: 'api/v1/tickets/vehicle-brandings/{ticketId}/videos/{ticketVideoType}/upload-url',
      },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: String })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public getTicketVideoUploadUrl(
    @Param('ticketId') ticketId: string,
    @Query('fileSize') fileSize: number,
    @Query('category') category: VehicleVideoCategory,
    @Query('ticketType') ticketType: TicketType,
    @UserToken() token: Jwt,
  ): Observable<UploadFileUrlDto> {
    return this.ticketsService.getTicketVideoUploadUrl(token, ticketId, category, Number(fileSize), ticketType);
  }

  @Delete('/:ticketId/video')
  @ApiOperation(
    buildApiOperationOptions([
      {
        service: 'P',
        method: 'DELETE',
        url: '/api/v1/tickets/vehicle-brandings/{ticketId}/videos/{vehicleVideoType}',
      },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public deleteTicketVideo(
    @Param('ticketId') ticketId: string,
    @Query('category') category: VehicleVideoCategory,
    @Query('ticketType') ticketType: TicketType,
    @UserToken() token: Jwt,
  ): Observable<void> {
    return this.ticketsService.deleteTicketVideo(token, ticketId, category, ticketType);
  }

  @Post('/:ticketId/driver-photo-control/send')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'POST', url: 'api/v1/tickets/driver-photo-control/{ticket-id}/:send' },
    ]),
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  public sendDriverPhotoControlTicket(@Param('ticketId') ticketId: string, @UserToken() token: Jwt): Observable<void> {
    return this.ticketsService.sendDriverPhotoControlTicket(ticketId, token);
  }
}
