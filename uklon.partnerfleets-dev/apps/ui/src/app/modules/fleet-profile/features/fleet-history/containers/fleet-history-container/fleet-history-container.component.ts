import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FleetHistoryChangeItemDto,
  FleetHistoryFiltersDto,
  FleetHistoryRequestParamsDto,
  FleetHistoryType,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { FleetService } from '@ui/core';
import { FleetHistoryFiltersComponent } from '@ui/modules/fleet-profile/features/fleet-history/components/fleet-history-filters/fleet-history-filters.component';
import { FleetHistoryListComponent } from '@ui/modules/fleet-profile/features/fleet-history/components/fleet-history-list/fleet-history-list.component';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { tap, map, finalize, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-fleet-history-container',
  standalone: true,
  imports: [
    FleetHistoryFiltersComponent,
    FleetHistoryListComponent,
    ScrolledDirectiveModule,
    EmptyStateComponent,
    TranslateModule,
  ],
  templateUrl: './fleet-history-container.component.html',
  styleUrls: ['./fleet-history-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetHistoryContainerComponent {
  public fleetId = input.required<string>();

  public readonly emptyState = EmptyStates;
  public filters: FleetHistoryFiltersDto;
  public additionalInfo = new Map<string, Observable<FleetHistoryChangeItemDto>>();

  public readonly history = signal<FleetHistoryChangeItemDto[]>([]);
  public readonly hasNext = signal(false);
  public readonly isLoading = signal(false);

  private readonly cursor = signal(0);

  private readonly fleetService = inject(FleetService);
  private readonly destroyRef = inject(DestroyRef);

  public onFiltersChange(filters: FleetHistoryFiltersDto): void {
    this.filters = filters;
    this.getFleetHistory();
  }

  public onLoadNext(): void {
    if (!this.hasNext() || this.isLoading()) return;
    this.getFleetHistory(true);
  }

  public onGetFullInfo({ change_type, id, has_additional_data }: FleetHistoryChangeItemDto): void {
    if (this.additionalInfo.get(id) || !has_additional_data) return;
    this.additionalInfo.set(id, this.getAdditionalInfo(change_type, id));
  }

  private getFleetHistory(loadMore: boolean = false): void {
    this.isLoading.set(true);

    if (!loadMore) {
      this.cursor.set(0);
    }

    this.fleetService
      .getFleetHistory(this.fleetId(), this.getParams())
      .pipe(
        catchError(() => of({ items: [], next_cursor: '0' })),
        tap(({ next_cursor }) => {
          this.hasNext.set(!!Number(next_cursor));
          this.cursor.set(Number(next_cursor));
        }),
        map(({ items }) => items),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => this.history.set(loadMore ? [...this.history(), ...items] : items));
  }

  private getAdditionalInfo(changeType: FleetHistoryType, changeId: string): Observable<FleetHistoryChangeItemDto> {
    return this.fleetService.getFleetHistoryAdditionalInfo(this.fleetId(), changeType, changeId);
  }

  private getParams(): FleetHistoryRequestParamsDto {
    return {
      limit: DEFAULT_LIMIT,
      cursor: this.cursor(),
      changeType: this.filters.changeType,
    };
  }
}
