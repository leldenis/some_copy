import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable, InjectionToken } from '@angular/core';
import { TicketType } from '@constant';
import { PhotoType, UploadFileUrlDto, VehicleVideoCategory } from '@data-access';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { Observable } from 'rxjs';

export const TICKET_FILE_UPLOAD_SERVICE = new InjectionToken<TicketFileUpload>('uploadService');

export interface TicketFileUpload {
  getTicketImageUploadUrl: (
    ticketId: string,
    category: PhotoType,
    fileSize: number,
    ticketType: TicketType,
  ) => Observable<UploadFileUrlDto>;

  uploadFile: (uploadUrl: string, file: File) => Observable<HttpEvent<unknown>>;
}

@Injectable({ providedIn: 'root' })
export class TicketFileUploadService implements TicketFileUpload {
  constructor(
    protected readonly http: HttpClient,
    protected readonly ticketsService: TicketsService,
  ) {}

  public getTicketImageUploadUrl(
    ticketId: string,
    category: PhotoType,
    fileSize: number,
    ticketType: TicketType = TicketType.VEHICLE_TO_FLEET_ADDITION,
  ): Observable<UploadFileUrlDto> {
    return this.ticketsService.getTicketFileUploadUrl(ticketId, category, ticketType, fileSize);
  }

  public getTicketVideoUploadUrl(
    ticketId: string,
    fileSize: number,
    category: VehicleVideoCategory = VehicleVideoCategory.VEHICLE_BRANDING_REVIEW,
    ticketType: TicketType = TicketType.VEHICLE_BRANDING_PERIOD,
  ): Observable<UploadFileUrlDto> {
    return this.ticketsService.getTicketVideoUploadUrl(ticketId, category, ticketType, fileSize);
  }

  public uploadFile(uploadUrl: string, file: File): Observable<HttpEvent<unknown>> {
    return this.http.put(uploadUrl, file, {
      reportProgress: true,
      observe: 'events',
      headers: {
        skipIntercept: 'true',
      },
    });
  }

  public deleteVideo(
    ticketId: string,
    category: VehicleVideoCategory = VehicleVideoCategory.VEHICLE_BRANDING_REVIEW,
    ticketType: TicketType = TicketType.VEHICLE_BRANDING_PERIOD,
  ): Observable<void> {
    return this.http.delete<void>(`api/tickets/${ticketId}/video`, {
      params: { category, ticketType },
    });
  }
}
