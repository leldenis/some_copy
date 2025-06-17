import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AnalyticsEventDto, FleetAnalyticsEventType, CustomAnalyticsPropertiesDto } from '@data-access';
import { TranslateService } from '@ngx-translate/core';
import { ANALYTICS_PAGE } from '@ui/shared/tokens';
import { environment } from '@ui-env/environment';
import { buffer, catchError, debounceTime, EMPTY, Observable, Subject, switchMap } from 'rxjs';

import { InterceptorSkipHeader, toServerDate } from '@uklon/angular-core';

import { HttpClientService } from './http-client.service';
import { fleetIdKey, storageDeviceKey, StorageService, userRoleKey } from './storage.service';

const ANALYTICS_URL = 'api/analytics/register-event';
const APP_VERSION = '1.80.1';

@Injectable({ providedIn: 'root' })
export class AnalyticsService extends HttpClientService {
  private readonly analyticsEvents$ = new Subject<AnalyticsEventDto>();
  private readonly page = inject(ANALYTICS_PAGE);

  constructor(
    private readonly http: HttpClient,
    private readonly translateService: TranslateService,
    private readonly storageService: StorageService,
  ) {
    super();

    this.analyticsEvents$
      .pipe(
        buffer(this.analyticsEvents$.pipe(debounceTime(1000))),
        switchMap((events) => this.sendAnalyticsEvents(events)),
      )
      .subscribe();
  }

  public reportEvent<T = CustomAnalyticsPropertiesDto>(
    event_type: FleetAnalyticsEventType,
    custom_properties?: T,
  ): void {
    const analyticsEvent = this.createEvent<T>(event_type, custom_properties);
    this.analyticsEvents$.next(analyticsEvent);
  }

  private createEvent<T = CustomAnalyticsPropertiesDto>(
    event_type: FleetAnalyticsEventType,
    custom_properties?: T,
  ): AnalyticsEventDto<T> {
    const user_agent = navigator.userAgent;
    const user_id = this.storageService.get('user_id') || '';
    const device_id = this.storageService.get(storageDeviceKey) || '';
    const client_id = environment.clientId;
    const user_access = this.storageService.get(userRoleKey) || '';
    const page = (custom_properties as CustomAnalyticsPropertiesDto)?.page ?? this.page();
    const fleet_id = this.storageService.get(fleetIdKey) || '';

    return {
      client_id,
      event_type,
      user_id,
      device_id,
      locale: this.translateService.currentLang,
      client_type: 'fleets_web',
      custom_properties: { ...custom_properties, user_agent, user_access, page, fleet_id },
      event_timestamp: toServerDate(new Date()),
      app: {
        name: 'Admin.Web.FleetsManagement',
        version: APP_VERSION,
      },
    };
  }

  private sendAnalyticsEvents(events: AnalyticsEventDto[]): Observable<void> {
    const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.http.post<void>(this.buildUrl(ANALYTICS_URL), events, { headers }).pipe(catchError(() => EMPTY));
  }
}
