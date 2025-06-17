import { HttpControllerService } from '@api/common/http/http-controller.service';
import { addBlockedByManagerStatus } from '@api/common/utils';
import { TICKET_TYPE_TO_URL } from '@api/common/utils/ticket-type-to-url';
import { PartnersService } from '@api/datasource/partners.service';
import { PhotoSize, TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import {
  AddVehicleTicketDto,
  CollectionCursorDto,
  PaginationCollectionDto,
  PhotoControlHasActiveTicketsDto,
  PhotosDto,
  TicketDto,
  UploadFileUrlDto,
  VehiclePhotoControlTicketDto,
  VehiclePhotoControlTicketItemDto,
  VehiclePhotoControlTicketsQueryParamsDto,
  VehicleTicketConfigDto,
  VehicleTicketCreationDto,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
  UploadPictureUrlResponseDto,
  VehicleBrandingPeriodTicketQueryParamsDto,
  VehicleBrandingPeriodTicketItemDto,
  VehicleBrandingMonthlyCodeDto,
  UploadVideoUrlResponseDto,
  VehicleVideoCategory,
  VehicleBrandingPeriodTicketDto,
  FleetVehicleOption,
} from '@data-access';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { Jwt } from '@uklon/nest-core';

const TICKETS_URL = 'api/v1/tickets';
const TICKET_BY_ID_URL = 'api/v1/tickets/{0}';
const VEHICLE_CREATION_TICKETS = `${TICKETS_URL}/vehicle-additions/{0}`;
const TICKET_IMAGES_URL = `${VEHICLE_CREATION_TICKETS}/images`;
const TICKET_IMAGES_UPLOAD_URL = `${VEHICLE_CREATION_TICKETS}/images/{1}/upload-url`;
const FLEET_VEHICLE_TICKET_BY_ID_URL = 'api/v1/fleets/{0}/vehicles/{1}';
const TICKET_STATUS_SENT = `${TICKETS_URL}/vehicle-additions/review-awaiters`;
const TICKET_PHOTO_CONTROL_IMAGES_UPLOAD_URL = `api/v1/tickets/vehicle-photo-control/{0}/images/{1}/upload-url`;

@Injectable()
export class TicketsService extends HttpControllerService {
  constructor(private readonly partnersService: PartnersService) {
    super();
  }

  public postFleetVehicleById(
    token: Jwt,
    fleetId: string,
    vehicleId: string,
    body: VehicleTicketCreationDto,
  ): Observable<void> {
    const url = this.buildUrl(FLEET_VEHICLE_TICKET_BY_ID_URL, fleetId, vehicleId);

    return this.partnersService.post<void>(url, body, { token });
  }

  public sendVehiclePhotoControlTicket(token: Jwt, ticketId: string): Observable<void> {
    return this.partnersService.post(`/api/v1/tickets/vehicle-photo-control/${ticketId}/:send`, {}, { token });
  }

  public updateVehiclePhotoControlTicket(
    token: Jwt,
    ticketId: string,
    body: {
      options: FleetVehicleOption[];
    },
  ): Observable<void> {
    return this.partnersService.patch(`/api/v1/tickets/vehicle-photo-control/${ticketId}`, body, { token });
  }

  /**
   * @deprecated The method should not be used
   */
  public getVehicleTicketImageUrl(
    token: Jwt,
    ticketId: string,
    category: VehiclePhotosCategory,
    contentLength: number,
    ticketType: TicketType = TicketType.DRIVER_TO_FLEET_ADDITION,
  ): Observable<UploadFileUrlDto> {
    const url =
      ticketType === TicketType.DRIVER_TO_FLEET_ADDITION
        ? TICKET_IMAGES_UPLOAD_URL
        : TICKET_PHOTO_CONTROL_IMAGES_UPLOAD_URL;
    return (
      this.partnersService
        // eslint-disable-next-line @typescript-eslint/naming-convention
        .get<{ 'upload-url': string; 'get-url': string }>(this.buildUrl(url, ticketId, category), {
          token,
          params: {
            content_length: contentLength,
          },
        })
        .pipe(
          map((response) => ({
            uploadUrl: response?.['upload-url'],
            getUrl: response?.['get-url'],
          })),
        )
    );
  }

  public getVehicleTicketImage(token: Jwt, tickerId: string, image_size: PhotoSize): Observable<PhotosDto> {
    const url = this.buildUrl(TICKET_IMAGES_URL, tickerId);

    return this.partnersService.get<PhotosDto>(url, { token, params: { image_size } });
  }

  public getVehicleTickets(
    token: Jwt,
    fleetId: string,
    license_plate: string,
    status: TicketStatus,
    offset = 0,
    limit = 30,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    const params = addBlockedByManagerStatus({
      license_plate,
      status,
      offset,
      limit,
    });

    return this.partnersService.get<PaginationCollectionDto<VehicleTicketDto>>(
      `api/v1/fleets/${fleetId}/vehicle-addition-tickets`,
      {
        token,
        params,
        paramsSerializer: {
          serialize: this.paramsSerializer,
        },
      },
    );
  }

  public getVehicleAdditionTicketByLicensePlate(
    token: Jwt,
    fleetId: string,
    license_plate: string,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    return this.partnersService.get<PaginationCollectionDto<VehicleTicketDto>>(
      `api/v1/fleets/${fleetId}/vehicle-addition-tickets`,
      {
        token,
        params: { license_plate, offset: 0, limit: 1 },
      },
    );
  }

  public getVehicleCreationTicket(token: Jwt, ticketId: string): Observable<AddVehicleTicketDto> {
    const url = this.buildUrl(VEHICLE_CREATION_TICKETS, ticketId);

    return this.partnersService.get<AddVehicleTicketDto>(url, { token });
  }

  public updateVehicleCreationTicket(token: Jwt, body: VehicleTicketUpdateDto, ticketId: string): Observable<void> {
    const url = this.buildUrl(VEHICLE_CREATION_TICKETS, ticketId);

    return this.partnersService.put<void>(url, body, { token });
  }

  public setVehicleCreationTicketSentStatus(token: Jwt, body: TicketDto): Observable<void> {
    const url = this.buildUrl(TICKET_STATUS_SENT);

    return this.partnersService.put<void>(url, body, { token });
  }

  public deleteTicket(token: Jwt, ticketId: string): Observable<void> {
    const url = this.buildUrl(TICKET_BY_ID_URL, ticketId);

    return this.partnersService.delete<void>(url, { token });
  }

  public getVehiclePhotoControlTicket(token: Jwt, ticketId: string): Observable<VehiclePhotoControlTicketDto> {
    return this.partnersService.get(`api/v1/tickets/vehicle-photo-control/${ticketId}`, { token });
  }

  public getFleetVehiclesPhotoControlTickets(
    token: Jwt,
    fleetId: string,
    query: VehiclePhotoControlTicketsQueryParamsDto,
  ): Observable<CollectionCursorDto<VehiclePhotoControlTicketItemDto>> {
    const params = addBlockedByManagerStatus<VehiclePhotoControlTicketsQueryParamsDto>(query);

    return this.partnersService.get(`api/v1/fleets/${fleetId}/tickets/vehicles/photo-control`, {
      token,
      params: {
        ...params,
        license_plate: params.licensePlate,
        created_at_from: params.from,
        created_at_to: params.to,
      },
      paramsSerializer: {
        serialize: this.paramsSerializer,
      },
    });
  }

  public getFleetActivePhotoControlExist(fleetId: string, token: Jwt): Observable<PhotoControlHasActiveTicketsDto> {
    return this.partnersService
      .get(`api/v1/fleets/${fleetId}/tickets/vehicles/photo-control`, {
        token,
        params: {
          status: [TicketStatus.DRAFT, TicketStatus.CLARIFICATION],
          limit: 1,
          cursor: -1,
        },
        paramsSerializer: {
          serialize: this.paramsSerializer,
        },
      })
      .pipe(map(({ items }) => ({ has_active_tickets: items.length > 0 })));
  }

  public getFleetVehiclesBrandingPeriodTickets(
    token: Jwt,
    fleetId: string,
    query: VehicleBrandingPeriodTicketQueryParamsDto,
  ): Observable<CollectionCursorDto<VehicleBrandingPeriodTicketItemDto>> {
    return this.partnersService.get(`api/v1/fleets/${fleetId}/tickets/vehicles/branding-period`, {
      token,
      params: {
        ...query,
        created_at_from: query.from,
        created_at_to: query.to,
      },
    });
  }

  public getFleetVehicleBrandingsMonthlyCode(token: Jwt): Observable<string> {
    return this.partnersService
      .get<VehicleBrandingMonthlyCodeDto>(`api/v1/tickets/vehicle-brandings/monthly-code`, { token })
      .pipe(map((response) => response?.monthly_code));
  }

  public getVehicleBrandingPeriodTicket(ticketId: string, token: Jwt): Observable<VehicleBrandingPeriodTicketDto> {
    return this.partnersService.get(`api/v1/tickets/vehicle-brandings/${ticketId}`, { token });
  }

  public sendVehicleBrandingPeriodTicket(ticketId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`/api/v1/tickets/vehicle-brandings/${ticketId}/:send`, {}, { token });
  }

  public getTicketConfig(ticketId: string, token: Jwt): Observable<VehicleTicketConfigDto> {
    return this.partnersService.get(`api/v1/tickets/${ticketId}/configuration`, {
      token,
      params: { for_ticket_status: 'Approved', ticket_type: 'VehicleToFleetAddition' },
    });
  }

  public getTicketConfigByRegionId(token: Jwt, regionId: number): Observable<VehicleTicketConfigDto> {
    return this.partnersService.get(`api/v1/tickets/configuration`, {
      token,
      params: {
        for_ticket_status: TicketStatus.APPROVED,
        ticket_type: TicketType.VEHICLE_TO_FLEET_ADDITION,
        region_id: regionId,
      },
    });
  }

  public getVehicleTicketUploadUrl(
    token: Jwt,
    ticketId: string,
    category: VehiclePhotosCategory,
    content_length: number,
    ticketType: TicketType = TicketType.VEHICLE_TO_FLEET_ADDITION,
  ): Observable<UploadFileUrlDto> {
    const url = `api/v1/tickets/${TICKET_TYPE_TO_URL[ticketType]}/${ticketId}/images/${category}/upload-url`;

    return this.partnersService
      .get<UploadPictureUrlResponseDto>(url, {
        params: { content_length },
        token,
      })
      .pipe(
        map(({ 'upload-url': uploadUrl, 'get-url': getUrl }) => ({
          uploadUrl,
          getUrl,
        })),
      );
  }

  public getTicketVideoUploadUrl(
    token: Jwt,
    ticketId: string,
    category: VehicleVideoCategory,
    content_length: number,
    ticketType = TicketType.VEHICLE_BRANDING_PERIOD,
  ): Observable<UploadFileUrlDto> {
    const url = `api/v1/tickets/${TICKET_TYPE_TO_URL[ticketType]}/${ticketId}/videos/${category}/upload-url`;

    return this.partnersService
      .get<UploadVideoUrlResponseDto>(url, {
        params: { content_length },
        token,
      })
      .pipe(
        map(({ upload_url, get_url }) => ({
          uploadUrl: upload_url,
          getUrl: get_url,
        })),
      );
  }

  public deleteTicketVideo(
    token: Jwt,
    ticketId: string,
    category: VehicleVideoCategory,
    ticketType = TicketType.VEHICLE_BRANDING_PERIOD,
  ): Observable<void> {
    const url = `api/v1/tickets/${TICKET_TYPE_TO_URL[ticketType]}/${ticketId}/videos/${category}`;
    return this.partnersService.delete(url, { token });
  }

  public sendDriverPhotoControlTicket(ticketId: string, token: Jwt): Observable<void> {
    return this.partnersService.post(`api/v1/tickets/driver-photo-control/${ticketId}/:send`, {}, { token });
  }
}
