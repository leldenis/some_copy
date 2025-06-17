import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PhotoSize, TicketStatus, TicketType, VehiclePhotosCategory } from '@constant';
import {
  AddVehicleTicketDto,
  CollectionCursorDto,
  FleetVehicleOption,
  PaginationCollectionDto,
  PhotoControlHasActiveTicketsDto,
  PhotosDto,
  PhotoType,
  TicketDto,
  UploadFileUrlDto,
  VehicleBrandingPeriodTicketDto,
  VehicleBrandingPeriodTicketItemDto,
  VehicleBrandingPeriodTicketQueryParamsDto,
  VehiclePhotoControlListQueryParamsDto,
  VehiclePhotoControlTicketDto,
  VehiclePhotoControlTicketItemDto,
  VehicleTicketConfigDto,
  VehicleTicketCreationDto,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
  VehicleVideoCategory,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import _, { isNil, omitBy } from 'lodash';
import { Observable } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

const TICKETS_URL = 'api/tickets';
const TICKET_BY_ID_URL = `${TICKETS_URL}/{0}`;
const TICKET_IMAGES_URL = `${TICKET_BY_ID_URL}/images`;
const FLEET_VEHICLE_TICKETS = `${TICKETS_URL}/fleets/{0}`;
const VEHICLE_ADDITION = `${TICKETS_URL}/vehicle-additions/{0}`;
const TICKET_STATUS_SENT = `${TICKETS_URL}/vehicle-additions/review-awaiters`;

@Injectable({ providedIn: 'root' })
export class TicketsService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public postFleetVehicleById(
    fleetId: string,
    vehicleId: string,
    body: Partial<VehicleTicketCreationDto>,
  ): Observable<void> {
    return this.http.post<void>(`api/tickets/fleets/${fleetId}/vehicles/${vehicleId}`, body);
  }

  public putVehicleTicketImage(
    ticketId: string,
    vehiclePhotoCategory: VehiclePhotosCategory,
    file: File,
    ticketType: TicketType = TicketType.DRIVER_TO_FLEET_ADDITION,
  ): Observable<UploadFileUrlDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<UploadFileUrlDto>(this.buildUrl(TICKET_IMAGES_URL, ticketId), formData, {
      params: {
        category: vehiclePhotoCategory,
        ticketType,
      },
    });
  }

  public getVehicleTicketPhotos(ticketId: string, image_size: PhotoSize): Observable<PhotosDto> {
    return this.http.get<PhotosDto>(this.buildUrl(TICKET_IMAGES_URL, ticketId), {
      params: {
        image_size,
      },
    });
  }

  public getFleetVehiclesTickets(
    fleetId: string,
    license_plate: string,
    status: TicketStatus | '',
    offset: number,
    limit: number,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    const params = _.omitBy(
      {
        license_plate,
        status,
        offset,
        limit,
      },
      (value) => isNil(value) || value === '',
    );

    return this.http.get<PaginationCollectionDto<VehicleTicketDto>>(this.buildUrl(FLEET_VEHICLE_TICKETS, fleetId), {
      params,
    });
  }

  public getVehicleAdditionTicketByLicensePlate(
    fleetId: string,
    licensePlate: string,
  ): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    return this.http.get<PaginationCollectionDto<VehicleTicketDto>>(`api/tickets/vehicle-addition/fleets/${fleetId}`, {
      params: { licensePlate },
    });
  }

  public getFleetVehiclesCreationTicket(ticketId: string): Observable<AddVehicleTicketDto> {
    return this.http.get<AddVehicleTicketDto>(this.buildUrl(VEHICLE_ADDITION, ticketId));
  }

  public updateFleetVehiclesCreationTicket(ticketId: string, body: Partial<VehicleTicketUpdateDto>): Observable<void> {
    return this.http.put<void>(this.buildUrl(VEHICLE_ADDITION, ticketId), body);
  }

  public setVehicleCreationTicketSentStatus(body: TicketDto): Observable<void> {
    return this.http.put<void>(this.buildUrl(TICKET_STATUS_SENT), body);
  }

  public deleteTicket(ticketId: string): Observable<void> {
    return this.http.delete<void>(this.buildUrl(TICKET_BY_ID_URL, ticketId));
  }

  public getFleetVehiclePhotoControlTicket(ticketId: string): Observable<VehiclePhotoControlTicketDto> {
    return this.http.get<VehiclePhotoControlTicketDto>(`api/tickets/vehicle-photo-control/${ticketId}`);
  }

  public updateFleetVehiclePhotoControlTicket(ticketId: string, options: FleetVehicleOption[]): Observable<void> {
    return this.http.patch<void>(`api/tickets/vehicle-photo-control/${ticketId}`, { options });
  }

  public sendVehiclePhotoControlTicket(ticketId: string): Observable<void> {
    return this.http.post<void>(`api/tickets/vehicle-photo-control/${ticketId}/:send`, {});
  }

  public getFleetVehiclesPhotoControlTickets(
    fleetId: string,
    { licensePlate, status, cursor, limit, period: { from, to } }: VehiclePhotoControlListQueryParamsDto,
  ): Observable<CollectionCursorDto<VehiclePhotoControlTicketItemDto>> {
    const params = omitBy(
      {
        licensePlate,
        status,
        cursor,
        limit,
        from: toServerDate(new Date(from)),
        to: toServerDate(new Date(to)),
      },
      (value) => value === '',
    );

    return this.http.get<CollectionCursorDto<VehiclePhotoControlTicketItemDto>>(
      `api/tickets/fleets/${fleetId}/vehicles/vehicle-photo-control`,
      { params },
    );
  }

  public getFleetActivePhotoControlExist(fleetId: string): Observable<PhotoControlHasActiveTicketsDto> {
    return this.http.get<PhotoControlHasActiveTicketsDto>(
      `api/tickets/fleets/${fleetId}/vehicles/vehicle-photo-control/has-active-tickets`,
    );
  }

  public getFleetVehiclesBrandingPeriodTickets(
    fleetId: string,
    { status, from, to, cursor, limit, license_plate }: VehicleBrandingPeriodTicketQueryParamsDto,
  ): Observable<CollectionCursorDto<VehicleBrandingPeriodTicketItemDto>> {
    const statusValues = status?.filter((item) => item !== TicketStatus.ALL);

    return this.http.get<CollectionCursorDto<VehicleBrandingPeriodTicketItemDto>>(
      `api/tickets/fleets/${fleetId}/vehicles/branding-periods`,
      {
        params: {
          ...(statusValues && { status: statusValues }),
          ...(license_plate && { license_plate }),
          cursor,
          limit,
          from: toServerDate(new Date(from)),
          to: toServerDate(new Date(to)),
        },
      },
    );
  }

  public getVehicleBrandingMonthlyCode(): Observable<string> {
    return this.http.get<string>(`api/tickets/vehicle-brandings/monthly-code`);
  }

  public getVehicleBrandingPeriodTicket(ticketId: string): Observable<VehicleBrandingPeriodTicketDto> {
    return this.http.get<VehicleBrandingPeriodTicketDto>(`api/tickets/${ticketId}/vehicle-branding`);
  }

  public sendVehicleBrandingPeriodTicket(ticketId: string): Observable<void> {
    return this.http.post<void>(`api/tickets/${ticketId}/vehicle-branding/send`, {});
  }

  public getTicketConfig(ticketId: string): Observable<VehicleTicketConfigDto> {
    return this.http.get<VehicleTicketConfigDto>(`api/tickets/${ticketId}/configuration`);
  }

  public getTicketConfigByRegionId(regionId: number): Observable<VehicleTicketConfigDto> {
    return this.http.get<VehicleTicketConfigDto>(`api/tickets/configuration`, { params: { regionId } });
  }

  public getTicketFileUploadUrl(
    ticketId: string,
    category: PhotoType,
    ticketType: TicketType,
    fileSize: number,
  ): Observable<UploadFileUrlDto> {
    return this.http.get<UploadFileUrlDto>(`api/tickets/${ticketId}/image-upload-url`, {
      params: {
        category,
        ticketType,
        fileSize,
      },
    });
  }

  public getTicketVideoUploadUrl(
    ticketId: string,
    category: VehicleVideoCategory,
    ticketType: TicketType,
    fileSize: number,
  ): Observable<UploadFileUrlDto> {
    return this.http.get<UploadFileUrlDto>(`api/tickets/${ticketId}/video-upload-url`, {
      params: {
        category,
        ticketType,
        fileSize,
      },
    });
  }
}
