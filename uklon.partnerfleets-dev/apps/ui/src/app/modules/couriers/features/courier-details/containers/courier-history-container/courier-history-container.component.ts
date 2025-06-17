import { AsyncPipe, KeyValuePipe, NgClass, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
} from '@angular/material/expansion';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatOption, MatSelect } from '@angular/material/select';
import { CourierHistoryChange } from '@constant';
import { CourierHistoryChangeItemDto, HistoryInitiatorType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CourierHistoryDetailsComponent } from '@ui/modules/couriers/features/courier-details/components/courier-history-details/courier-history-details.component';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { ProgressSpinnerComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-courier-history-container',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    ReactiveFormsModule,
    MatFormField,
    TranslateModule,
    MatSelect,
    MatOption,
    KeyValuePipe,
    AsyncPipe,
    MatAccordion,
    ScrolledDirectiveModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelDescription,
    NgClass,
    Seconds2DatePipe,
    Seconds2TimePipe,
    MatIcon,
    UpperCasePipe,
    CourierHistoryDetailsComponent,
    ProgressSpinnerComponent,
    EmptyStateComponent,
    MatLabel,
  ],
  templateUrl: './courier-history-container.component.html',
  styleUrls: ['./courier-history-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierHistoryContainerComponent {
  @Input() public fleetId: string;
  @Input() public courierId: string;
  @Input() public tabIndex: number;

  public readonly changeType = CourierHistoryChange;

  public filtersForm = new FormGroup({
    changeType: new FormControl<CourierHistoryChange | ''>(''),
  });

  public readonly emptyState = EmptyStates;
  public readonly initiatorType = HistoryInitiatorType;
  public readonly notExpandable: Record<string, boolean> = {
    [CourierHistoryChange.PHONE_CHANGED]: true,
    [CourierHistoryChange.REGISTERED]: true,
    [CourierHistoryChange.ADDED_TO_FLEET]: true,
    [CourierHistoryChange.REMOVED_FROM_FLEET]: true,
  };

  public isLoading = false;
  public additionalInfo = new Map<string, Observable<CourierHistoryChangeItemDto>>();

  public history$ = new BehaviorSubject<CourierHistoryChangeItemDto[]>(null);

  private cursor = 0;
  private hasNext: boolean;
  private readonly limit = 20;

  constructor(private readonly couriersService: CouriersService) {}

  public onFiltersChange(changeType: CourierHistoryChange | ''): void {
    this.getHistory(changeType);
  }

  public getFullInfo(changeType: CourierHistoryChange, changeId: string, hasAdditionalInfo: boolean): void {
    if (this.additionalInfo.get(changeId) || !hasAdditionalInfo) return;
    this.additionalInfo.set(changeId, this.getHistoryDetails(changeType, changeId));
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) return;
    this.getHistory(this.filtersForm.value.changeType, true);
  }

  public trackById(_: number, change: CourierHistoryChangeItemDto): string {
    return change.id;
  }

  private getHistory(changeType: CourierHistoryChange | '', loadMore = false): void {
    this.isLoading = true;
    this.cursor = loadMore ? this.cursor : 0;

    this.couriersService
      .getCourierHistory(this.courierId, {
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

  private getHistoryDetails(
    changeType: CourierHistoryChange,
    changeId: string,
  ): Observable<CourierHistoryChangeItemDto> {
    return this.couriersService.getCourierHistoryInfo(this.courierId, changeType, changeId);
  }
}
