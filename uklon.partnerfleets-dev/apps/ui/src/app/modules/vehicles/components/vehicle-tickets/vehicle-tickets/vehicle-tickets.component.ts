import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AnalyticsUserRole, AnalyticsVehicleFilter, FleetAnalyticsEventType } from '@data-access';
import { Store } from '@ngrx/store';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { VehicleTicketsFilterComponent } from '@ui/modules/vehicles/components/vehicle-tickets/vehicle-tickets-filter/vehicle-tickets-filter.component';
import { VehicleTicketsListComponent } from '@ui/modules/vehicles/components/vehicle-tickets/vehicle-tickets-list/vehicle-tickets-list.component';
import { VehicleTicketsFilterDto } from '@ui/modules/vehicles/models/vehicle-tickets-filter.dto';
import {
  getFleetVehiclesTickets,
  isVehiclesTicketsCollectionError,
  getFleetVehiclesTicketsTotalCount,
  vehicleTicketDeleted,
} from '@ui/modules/vehicles/store';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';
import { getPagination } from '@ui/shared/components/pagination/store/pagination.selectors';
import { ConfirmationComponent } from '@ui/shared/dialogs/confirmation/confirmation.component';
import { PaginationDto } from '@ui/shared/models/pagination.dto';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

type FilterKey = keyof VehicleTicketsFilterDto;

@Component({
  selector: 'upf-vehicle-tickets',
  standalone: true,
  imports: [EmptyStateComponent, VehicleTicketsFilterComponent, AsyncPipe, VehicleTicketsListComponent],
  templateUrl: './vehicle-tickets.component.html',
  styleUrls: ['./vehicle-tickets.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTicketsComponent implements OnInit, OnDestroy {
  @Input() public fleetId: string;

  public fleetVehiclesTicketsList$ = this.store.select(getFleetVehiclesTickets);
  public isVehiclesTicketsCollectionError$: Observable<boolean> = this.store.select(isVehiclesTicketsCollectionError);
  public vehiclesTicketsListTotalCount$ = this.store.select(getFleetVehiclesTicketsTotalCount);
  public readonly emptyState = EmptyStates;

  private filters: VehicleTicketsFilterDto;

  private readonly userRole: string = this.storage.get(userRoleKey);
  private readonly filtersChange$ = new BehaviorSubject<VehicleTicketsFilterDto>(null);
  private readonly ticketDeleted$ = this.store.select(vehicleTicketDeleted).pipe(filter(Boolean));
  private readonly destroyed$ = new Subject<void>();
  private readonly pagination$ = this.paginationStore
    .select(getPagination)
    .pipe(distinctUntilChanged((a: PaginationDto, b: PaginationDto) => a.offset === b.offset));

  constructor(
    private readonly store: Store<VehiclesState>,
    private readonly paginationStore: Store<PaginationState>,
    private readonly dialog: MatDialog,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {}

  public ngOnInit(): void {
    combineLatest([this.pagination$, this.filtersChange$.pipe(filter(Boolean))])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([{ offset, limit }, { license_plate, status }]: [PaginationDto, VehicleTicketsFilterDto]) => {
        this.store.dispatch(
          vehiclesActions.getFleetVehiclesTickets({
            offset,
            limit,
            status,
            fleetId: this.fleetId,
            license_plate: license_plate?.replace(/\s/g, ''),
          }),
        );
      });

    this.handleTicketDeleted();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onDeleteTicket(ticketId: string): void {
    this.reportDeleteTicket(FleetAnalyticsEventType.VEHICLES_TICKETS_DELETE_TICKET, ticketId);

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      panelClass: 'confirmation-modal',
      autoFocus: false,
      data: {
        title: 'Modals.Confirmation.Title',
        acceptBtn: 'Common.Buttons.B_Delete',
        declineBtn: 'Common.Buttons.B_Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.store.dispatch(vehiclesActions.deleteTicket({ ticketId }));
        this.reportDeleteTicket(FleetAnalyticsEventType.VEHICLES_TICKETS_DELETE_TICKET_CONFIRMED, ticketId);
      } else {
        this.reportDeleteTicket(FleetAnalyticsEventType.VEHICLES_TICKETS_DELETE_TICKET_CANCELED, ticketId);
      }
    });
  }

  public onFiltersChange(filters: VehicleTicketsFilterDto): void {
    this.reportFiltersChange(filters);
    this.paginationStore.dispatch(paginationActions.clearState());
    this.filtersChange$.next(filters);
  }

  public onAddVehicle(): void {
    this.analytics.reportEvent<AnalyticsUserRole>(FleetAnalyticsEventType.VEHICLES_TICKETS_ADD_VEHICLE, {
      user_access: this.userRole,
    });
  }

  private handleTicketDeleted(): void {
    this.ticketDeleted$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => this.filtersChange$.next(this.filtersChange$.value));
  }

  private reportDeleteTicket(eventType: FleetAnalyticsEventType, ticket_id: string): void {
    this.analytics.reportEvent(eventType, {
      ticket_id,
      user_access: this.userRole,
    });
  }

  private reportFiltersChange(newFilters: VehicleTicketsFilterDto): void {
    if (this.filters) {
      const changedProperties = (Object.keys(newFilters) as FilterKey[]).filter(
        (key: FilterKey) => newFilters[key] !== this.filters[key],
      );

      if (changedProperties.length === 0) return;

      changedProperties.forEach((prop) => {
        const eventType = this.detectChangedFilterProperty(prop);
        if (!eventType || !prop) return;

        this.analytics.reportEvent<AnalyticsVehicleFilter>(eventType, {
          user_access: this.userRole,
          [prop]: newFilters[prop],
        });
      });
    }

    this.filters = newFilters;
  }

  private detectChangedFilterProperty(key: FilterKey): FleetAnalyticsEventType {
    switch (key) {
      case 'license_plate':
        return FleetAnalyticsEventType.VEHICLES_TICKETS_LICENSE_PLATE_FILTER;
      case 'status':
        return FleetAnalyticsEventType.VEHICLES_TICKETS_STATUS_FILTER;
      default:
        return null;
    }
  }
}
