import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FleetDto, FleetCourierFeedbackDto } from '@data-access';
import { Store } from '@ngrx/store';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import {
  CouriersFeedbacksFiltersComponent,
  CouriersFeedbacksListComponent,
} from '@ui/modules/couriers-feedbacks/components';
import { CouriersFeedbackFiltersDto, CouriersFeedbackQueryParamsDto } from '@ui/modules/feedback/models/feedback.dto';
import { FeedbackService } from '@ui/modules/feedback/services/feedback.service';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { startOfDay, endOfDay } from 'date-fns';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable, filter, tap, BehaviorSubject } from 'rxjs';

import { toServerDate } from '@uklon/angular-core';

@Component({
  selector: 'upf-couriers-feedbacks-container',
  standalone: true,
  imports: [
    AsyncPipe,
    InfiniteScrollDirective,
    EmptyStateComponent,
    CouriersFeedbacksFiltersComponent,
    CouriersFeedbacksListComponent,
  ],
  templateUrl: './couriers-feedbacks-container.component.html',
  styleUrls: ['./couriers-feedbacks-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersFeedbacksContainerComponent implements OnDestroy {
  public fleet$: Observable<FleetDto> = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    tap(({ id }) => this.handleFleetChange(id)),
  );
  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();
  public feedbacks$ = new BehaviorSubject<FleetCourierFeedbackDto[]>([]);

  private offset = 0;
  private readonly limit = DEFAULT_LIMIT;
  private hasNext = false;
  private fleetId: string;
  private filters: CouriersFeedbackFiltersDto;

  constructor(
    private readonly store: Store<AccountState>,
    private readonly uiService: UIService,
    private readonly feedbackService: FeedbackService,
  ) {
    this.setShellConfig();
  }

  private get params(): CouriersFeedbackQueryParamsDto {
    return {
      limit: this.limit,
      offset: this.offset,
      created_at_from: toServerDate(startOfDay(this.filters.period.from)),
      created_at_to: toServerDate(endOfDay(this.filters.period.to)),
      courier_id: this.filters?.courierId || '',
    };
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onFiltersChange(filters: CouriersFeedbackFiltersDto): void {
    if (!filters) return;

    this.filters = filters;
    this.offset = 0;
    this.getFeedbacks();
  }

  public loadNext(): void {
    if (!this.hasNext) return;

    this.offset += this.limit;
    this.getFeedbacks(true);
  }

  private handleFleetChange(fleetId: string): void {
    this.fleetId = fleetId;
    this.offset = 0;
  }

  private getFeedbacks(loadNext = false): void {
    this.feedbackService.getCouriersFeedbacks(this.fleetId, this.params).subscribe(({ items, has_more_items }) => {
      const feedbacks = loadNext ? [...this.feedbacks$.value, ...items] : items;
      this.feedbacks$.next(feedbacks);
      this.hasNext = has_more_items;
    });
  }

  private setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: true,
        backNavigationButton: false,
      },
    });
  }
}
