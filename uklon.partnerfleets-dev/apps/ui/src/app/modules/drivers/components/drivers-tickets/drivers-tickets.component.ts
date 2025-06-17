import { AsyncPipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TicketStatus } from '@constant';
import {
  CollectionCursorDto,
  FleetAnalyticsEventType,
  FleetDriverRegistrationTicketDto,
  TicketOrigin,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { DriverService } from '@ui/core/services/datasource/driver.service';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { getConfig } from '@ui/core/store/root/root.selectors';
import { NotificationsQueryParamsDirective, StatusBadgeComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { DEFAULT_LIMIT, VEHICLE_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { ICONS } from '@ui/shared/tokens';
import { NgxMaskDirective } from 'ngx-mask';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

interface DriverTicketsFilters {
  phone: string;
  status: TicketStatus | string;
}

@Component({
  selector: 'upf-drivers-tickets',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    TranslateModule,
    MatInput,
    NgxMaskDirective,
    MatIcon,
    MatSuffix,
    MatOption,
    MatSelect,
    MatButtonModule,
    KeyValuePipe,
    AsyncPipe,
    MatTableModule,
    NgTemplateOutlet,
    Seconds2DatePipe,
    StatusBadgeComponent,
    NgxTippyModule,
    EmptyStateComponent,
    FiltersActionButtonDirective,
    NotificationsQueryParamsDirective,
  ],
  templateUrl: './drivers-tickets.component.html',
  styleUrls: ['./drivers-tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriversTicketsComponent implements OnInit {
  @Input() public fleetId: string;

  public readonly limit = DEFAULT_LIMIT;
  public readonly ticketStatus = TicketStatus;
  public readonly ticketStatusColorMap = VEHICLE_TICKET_STATUS_COLOR;
  public readonly filterKey = StorageFiltersKey.DRIVER_TICKETS;
  public readonly filtersForm = new FormGroup({
    phone: new FormControl<string>(''),
    status: new FormControl<TicketStatus | string>(''),
  });
  public readonly ticketOrigin = TicketOrigin;

  public readonly icons = inject(ICONS);
  public readonly store = inject(Store);
  public readonly driversService = inject(DriverService);
  public readonly analytics = inject(AnalyticsService);

  public readonly filters$ = new BehaviorSubject<DriverTicketsFilters>(null);
  public readonly registrationLink$: Observable<string | undefined> = this.store
    .select(getConfig)
    .pipe(map((cfg) => cfg?.externalLinks?.registration));
  public readonly tickets$ = combineLatest([
    this.store.select(getSelectedFleet).pipe(filter(Boolean)),
    this.filters$.pipe(filter(Boolean)),
  ]).pipe(switchMap(([{ id }, filters]) => this.getDriversTickets(id, filters)));

  public ngOnInit(): void {
    this.analytics.reportEvent(FleetAnalyticsEventType.DRIVERS_TICKETS_SCREEN);
  }

  public onFiltersChange(filters: DriverTicketsFilters): void {
    this.filters$.next(filters);
  }

  private getDriversTickets(
    fleetId: string,
    filters: DriverTicketsFilters,
  ): Observable<CollectionCursorDto<FleetDriverRegistrationTicketDto>> {
    return this.driversService.getTickets(fleetId, { limit: this.limit }, filters);
  }
}
