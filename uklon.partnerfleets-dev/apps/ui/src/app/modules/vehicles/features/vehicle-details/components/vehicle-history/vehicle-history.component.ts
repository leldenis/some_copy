import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HistoryInitiatorType, VehicleHistoryChangeItemDto, VehicleHistoryType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

import { VehicleHistoryDetailsComponent } from '../vehicle-history-details/vehicle-history-details.component';

@Component({
  selector: 'upf-vehicle-history',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    TranslateModule,
    ScrolledDirectiveModule,
    VehicleHistoryDetailsComponent,
    FiltersContainerComponent,
    ProgressSpinnerComponent,
    EmptyStateComponent,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './vehicle-history.component.html',
  styleUrls: ['./vehicle-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleHistoryComponent {
  @Input() public fleetId: string;
  @Input() public vehicleId: string;
  @Input() public tabIndex: number;

  public readonly filterKey = StorageFiltersKey.VEHICLE_HISTORY;
  public readonly historyType = VehicleHistoryType;
  public readonly initiatorType = HistoryInitiatorType;
  public readonly emptyState = EmptyStates;
  public readonly notExpandable: Record<string, boolean> = {
    [VehicleHistoryType.CREATED]: true,
    [VehicleHistoryType.REMOVED_FROM_FLEET]: true,
    [VehicleHistoryType.ADDED_TO_FLEET]: true,
  };
  public isLoading = false;
  public additionalInfo = new Map<string, Observable<VehicleHistoryChangeItemDto>>();
  public history$ = new BehaviorSubject<VehicleHistoryChangeItemDto[]>(null);
  public readonly filtersForm = new FormGroup({
    changeType: new FormControl<VehicleHistoryType | ''>(''),
  });

  private cursor = 0;
  private hasNext: boolean;
  private readonly limit = 20;

  constructor(private readonly vehicleService: VehiclesService) {}

  public trackById(_: number, change: VehicleHistoryChangeItemDto): string {
    return change.id;
  }

  public getFullInfo(changeType: VehicleHistoryType, changeId: string, hasAdditionalInfo: boolean): void {
    if (this.additionalInfo.get(changeId) || !hasAdditionalInfo) return;
    this.additionalInfo.set(changeId, this.getChangeDetails(changeType, changeId));
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getVehicleHistory(this.filtersForm.value.changeType, true);
  }

  public onFiltersChange(changeType: VehicleHistoryType | ''): void {
    this.getVehicleHistory(changeType);
  }

  private getVehicleHistory(changeType: VehicleHistoryType | '', loadMore = false): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : 0;

    this.vehicleService
      .getVehicleHistory(this.vehicleId, {
        cursor: this.cursor,
        limit: this.limit,
        fleetId: this.fleetId,
        changeType,
      })
      .pipe(
        tap(({ next_cursor }) => {
          this.hasNext = !!Number(next_cursor);
          this.cursor = Number(next_cursor);
        }),
        map(({ items }) => items),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((items) => {
        const history = loadMore ? [...this.history$.value, ...items] : items;
        this.history$.next(history);
      });
  }

  private getChangeDetails(changeType: VehicleHistoryType, changeId: string): Observable<VehicleHistoryChangeItemDto> {
    return this.vehicleService.getVehicleHistoryInfo(this.fleetId, this.vehicleId, changeType, changeId);
  }
}
