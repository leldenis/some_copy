import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollectionCursorDto, CursorPageRequestDto, UklonGarageFleetApplicationDto } from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UklonGarageService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getApplications(
    fleetId: string,
    { cursor, limit }: CursorPageRequestDto,
    { status, phone }: { status: string; phone: string },
  ): Observable<CollectionCursorDto<UklonGarageFleetApplicationDto>> {
    return this.http.get<CollectionCursorDto<UklonGarageFleetApplicationDto>>(
      `api/uklon-garage/fleets/${fleetId}/applications`,
      {
        params: {
          cursor,
          limit,
          status: status ?? '',
          phone: phone ?? '',
        },
      },
    );
  }

  public fleetHasApplications(fleetId: string): Observable<{ has_applications: boolean }> {
    return this.getApplications(
      fleetId,
      { cursor: '0', limit: 1 },
      {
        status: '',
        phone: '',
      },
    ).pipe(map(({ items }) => ({ has_applications: items?.length > 0 })));
  }

  public approveApplication(applicationId: string): Observable<void> {
    return this.http.post<void>(`api/uklon-garage/application/${applicationId}/approve`, {});
  }

  public rejectApplication(applicationId: string): Observable<void> {
    return this.http.post<void>(`api/uklon-garage/application/${applicationId}/reject`, {});
  }

  public reviewApplication(applicationId: string): Observable<void> {
    return this.http.post<void>(`api/uklon-garage/application/${applicationId}/review`, {});
  }
}
