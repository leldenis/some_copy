import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DriverHistoryChange, DriverHistoryChangeItemDto, HistoryInitiatorType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { DriverHistoryDetailsComponent } from '@ui/modules/drivers/features/driver-details/components/driver-history-details/driver-history-details.component';
import { ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, finalize, map, tap } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-driver-history',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatSelectModule,
    MatIconModule,
    DriverHistoryDetailsComponent,
    TranslateModule,
    ScrolledDirectiveModule,
    FiltersContainerComponent,
    ProgressSpinnerComponent,
    EmptyStateComponent,
    Seconds2DatePipe,
    Seconds2TimePipe,
  ],
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverHistoryComponent {
  @Input() public fleetId: string;
  @Input() public driverId: string;
  @Input() public tabIndex: number;

  public readonly filterKey = StorageFiltersKey.DRIVER_HISTORY;
  public readonly changeType = DriverHistoryChange;
  public readonly initiatorType = HistoryInitiatorType;
  public readonly emptyState = EmptyStates;
  public readonly notExpandable: Record<string, boolean> = {
    [DriverHistoryChange.BLACK_LIST_CLEARED]: true,
    [DriverHistoryChange.PASSWORD_CHANGED]: true,
    [DriverHistoryChange.PHONE_CHANGED]: true,
    [DriverHistoryChange.REGISTERED]: true,
    [DriverHistoryChange.ADDED_TO_FLEET]: true,
    [DriverHistoryChange.REMOVED_FROM_FLEET]: true,
    [DriverHistoryChange.KARMA_RESETED]: true,
    [DriverHistoryChange.PHOTO_CONTROL_CREATION_REJECTED]: true,
    [DriverHistoryChange.PHOTO_CONTROL_PASSED]: true,
    [DriverHistoryChange.PHOTO_CONTROL_FAILED]: true,
  };

  public isLoading = false;
  public additionalInfo = new Map<string, Observable<DriverHistoryChangeItemDto>>();
  public filtersForm = new FormGroup({
    changeType: new FormControl<DriverHistoryChange | ''>(''),
  });
  public history$ = new BehaviorSubject<DriverHistoryChangeItemDto[]>(null);

  private cursor = 0;
  private hasNext: boolean;
  private readonly limit = 20;

  constructor(private readonly driverService: DriverService) {}

  public trackById(_: number, change: DriverHistoryChangeItemDto): string {
    return change.id;
  }

  public getFullInfo(changeType: DriverHistoryChange, changeId: string, hasAdditionalInfo: boolean): void {
    if (this.additionalInfo.get(changeId) || !hasAdditionalInfo) return;
    this.additionalInfo.set(changeId, this.getChangeDetails(changeType, changeId));
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getDriverHistory(this.filtersForm.value.changeType, true);
  }

  public onFiltersChange(changeType: DriverHistoryChange | ''): void {
    this.getDriverHistory(changeType);
  }

  private getDriverHistory(changeType: DriverHistoryChange | '', loadMore = false): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : 0;

    this.driverService
      .getDriverHistory(this.driverId, {
        cursor: this.cursor,
        limit: this.limit,
        fleetId: this.fleetId,
        changeType,
      })
      .pipe(
        filter(Boolean),
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

  private getChangeDetails(changeType: DriverHistoryChange, changeId: string): Observable<DriverHistoryChangeItemDto> {
    return this.driverService.getDriverHistoryInfo(this.driverId, changeType, changeId);
  }
}
