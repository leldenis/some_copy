import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FleetDriverFeedbackDto, FleetDto, getCurrentWeek } from '@data-access';
import { Store } from '@ngrx/store';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { FeedbackFiltersComponent } from '@ui/modules/feedback/components/feedback-filters/feedback-filters.component';
import { FeedbackListComponent } from '@ui/modules/feedback/components/feedback-list/feedback-list.component';
import { FeedbackService } from '@ui/modules/feedback/services/feedback.service';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { endOfDay, startOfDay } from 'date-fns';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { toServerDate } from '@uklon/angular-core';

import { DriversFeedbackFiltersDto, DriversFeedbackQueryParamsDto } from '../../models/feedback.dto';

@Component({
  selector: 'upf-feedback',
  standalone: true,
  imports: [AsyncPipe, InfiniteScrollDirective, FeedbackFiltersComponent, FeedbackListComponent, EmptyStateComponent],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackComponent implements OnInit, OnDestroy {
  private offset = 0;
  private readonly limit = DEFAULT_LIMIT;
  private hasNext = false;
  private fleetId: string;
  private filters: DriversFeedbackFiltersDto = { period: getCurrentWeek() };

  private readonly store = inject(Store);
  private readonly uiService = inject(UIService);
  private readonly feedbackService = inject(FeedbackService);

  public fleet$: Observable<FleetDto> = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    tap(({ id }) => this.handleFleetChange(id)),
  );
  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();
  public feedbacks$ = new BehaviorSubject<FleetDriverFeedbackDto[]>([]);

  private get params(): DriversFeedbackQueryParamsDto {
    return {
      limit: this.limit,
      offset: this.offset,
      created_at_from: toServerDate(startOfDay(this.filters.period.from)),
      created_at_to: toServerDate(endOfDay(this.filters.period.to)),
      driver_id: this.filters?.driverId || '',
    };
  }

  public ngOnInit(): void {
    this.setShellConfig();
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onFiltersChange(filters: DriversFeedbackFiltersDto): void {
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
    this.feedbackService.getFeedbacks(this.fleetId, this.params).subscribe(({ items, has_more_items }) => {
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
