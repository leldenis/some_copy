import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import {
  CollectionCursorDto,
  FleetAnalyticsEventType,
  UklonGarageApplicationStatus,
  UklonGarageFleetApplicationDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { ToastService } from '@ui/core/services/toast.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import {
  ApplicationsListComponent,
  ApproveApplicationComponent,
} from '@ui/modules/drivers/features/uklon-garage/components';
import { ApplicationsFiltersComponent } from '@ui/modules/drivers/features/uklon-garage/components/applications-filters/applications-filters.component';
import { ApplicationsFiltersDto } from '@ui/modules/drivers/features/uklon-garage/models';
import { UklonGarageService } from '@ui/modules/drivers/services/uklon-garage.service';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { BehaviorSubject, combineLatest, finalize, map, Observable, scan, switchMap, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

const EMPTY_COLLECTION = {
  items: [],
  next_cursor: '',
  previous_cursor: '',
} as CollectionCursorDto<UklonGarageFleetApplicationDto>;

@Component({
  selector: 'upf-uklon-garage-applications',
  standalone: true,
  imports: [
    TranslateModule,
    ScrolledDirectiveModule,
    ApplicationsFiltersComponent,
    AsyncPipe,
    ApplicationsListComponent,
  ],
  templateUrl: './uklon-garage-applications.component.html',
  styleUrl: './uklon-garage-applications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UklonGarageApplicationsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store<AccountState>);
  private readonly garageService = inject(UklonGarageService);
  private readonly translateService = inject(TranslateService);
  private readonly analytics = inject(AnalyticsService);

  public readonly isLoading = signal(false);
  public readonly hasNext = signal(true);
  public readonly cursor = signal('0');
  public readonly limit = signal(DEFAULT_LIMIT);
  public readonly applications = signal<UklonGarageFleetApplicationDto[]>([]);

  public readonly loadNext$ = new BehaviorSubject<void>(null);
  public readonly filters$ = new BehaviorSubject<ApplicationsFiltersDto>(null);
  public readonly fleetId$ = this.store.select(selectedFleetId).pipe(
    filter(Boolean),
    tap(() => this.cursor.set('0')),
  );
  public readonly garageApplications$: Observable<UklonGarageFleetApplicationDto[]> = combineLatest([
    this.fleetId$,
    this.filtersChange$,
    this.loadNextChange$,
  ]).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap(([fleetId, filters]) => this.getApplications(fleetId, filters)),
    scan(
      ({ items: prevItems }, next) =>
        this.cursor() === '0' ? next : { ...next, items: [...prevItems, ...next.items] },
      EMPTY_COLLECTION,
    ),
    tap(({ next_cursor }) => {
      this.hasNext.set(!!Number(next_cursor));
      this.cursor.set(next_cursor);
    }),
    map(({ items }) => items),
    tap((items) => this.applications.set(items)),
  );

  private get filtersChange$(): Observable<ApplicationsFiltersDto> {
    return this.filters$.pipe(
      filter(Boolean),
      tap(() => this.cursor.set('0')),
    );
  }

  private get loadNextChange$(): Observable<void> {
    return this.loadNext$.pipe(filter(() => this.hasNext() && !this.isLoading()));
  }

  public handleApprove({ approve, index }: { approve: boolean; index: number }): void {
    const application = this.applications()[index];

    this.openDialog(approve)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          approve
            ? this.garageService.approveApplication(application.id)
            : this.garageService.rejectApplication(application.id),
        ),
        catchError((error) => {
          const message = this.translateService.instant(
            approve ? 'Notification.UklonGarage.CannotApproveApplication' : 'Notification.SomethingWentWrong',
          );
          this.toast.error(message);
          return throwError(() => error);
        }),
      )
      .subscribe(() =>
        this.updateApplicationStatus(
          index,
          approve ? UklonGarageApplicationStatus.APPROVED : UklonGarageApplicationStatus.REJECTED,
        ),
      );
  }

  public reviewApplication(index: number): void {
    const application = this.applications()[index];

    this.analytics.reportEvent(FleetAnalyticsEventType.UKLON_GARAGE_REVIEW_APPLICATION_CLICK, {
      request_id: application.id,
    });

    this.garageService
      .reviewApplication(application.id)
      .pipe(
        catchError((error) => {
          this.toast.error(this.translateService.instant('Notification.SomethingWentWrong'));
          return throwError(() => error);
        }),
      )
      .subscribe(() => this.updateApplicationStatus(index, UklonGarageApplicationStatus.REVIEW));
  }

  private getApplications(
    fleetId: string,
    filters: ApplicationsFiltersDto,
  ): Observable<CollectionCursorDto<UklonGarageFleetApplicationDto>> {
    const page = { cursor: this.cursor(), limit: this.limit() };
    return this.garageService.getApplications(fleetId, page, filters).pipe(finalize(() => this.isLoading.set(false)));
  }

  private openDialog(approve: boolean): Observable<void> {
    return this.dialog
      .open(ApproveApplicationComponent, {
        data: {
          title: approve
            ? 'Dialogs.ApproveGarageApplication.ApproveTitle'
            : 'Dialogs.ApproveGarageApplication.RejectTitle',
          content: approve
            ? 'Dialogs.ApproveGarageApplication.ApproveContent'
            : 'Dialogs.ApproveGarageApplication.RejectContent',
          okBtn: approve ? 'Common.Buttons.B_Confirm' : 'Common.Buttons.B_RejectApplication',
          cancelBtn: 'Common.Buttons.B_Cancel',
          approve,
        },
      })
      .afterClosed()
      .pipe(filter(Boolean));
  }

  private updateApplicationStatus(index: number, status: UklonGarageApplicationStatus): void {
    const application = this.applications()[index];
    const applications = structuredClone(this.applications());
    applications.splice(index, 1, { ...application, status });
    this.applications.set(applications);
  }
}
