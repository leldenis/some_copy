import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketStatus } from '@constant';
import { VehicleBasicInfoDto, VehicleBrandingPeriodTicketDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { VehicleBrandingPeriodVideoUploadComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/components';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { TicketStatusReasonsComponent, UIService } from '@ui/shared';
import { CanDeactivateComponent } from '@ui/shared/models';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';

@Component({
  selector: 'upf-vehicle-branding-period-control-form-form',
  standalone: true,
  imports: [VehicleBrandingPeriodVideoUploadComponent, MatButton, TranslateModule, TicketStatusReasonsComponent],
  templateUrl: './vehicle-branding-period-control-form.component.html',
  styleUrl: './vehicle-branding-period-control-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodControlFormComponent implements CanDeactivateComponent, OnDestroy {
  private readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  public readonly destroyRef = inject(DestroyRef);
  public readonly ticketsService = inject(TicketsService);
  public readonly uiService = inject(UIService);

  public readonly ticketStatus = TicketStatus;
  public readonly monthlyCode = this.route.snapshot.queryParamMap.get('monthlyCode') ?? '';

  public readonly ticket = toSignal<VehicleBrandingPeriodTicketDto>(
    this.route.data.pipe(map(({ data: { ticket } }) => ticket)),
  );
  public readonly vehicle = toSignal<VehicleBasicInfoDto>(
    this.route.data.pipe(
      filter(Boolean),
      map(({ data: { vehicle } }) => vehicle as VehicleBasicInfoDto),
    ),
  );
  public readonly clarificationReason = computed(() => {
    return (
      this.ticket()
        .activity_log.filter(({ status }) => status === TicketStatus.CLARIFICATION)
        .slice(-1) || []
    );
  });

  public readonly fileUploaded = signal<boolean>(false);
  public readonly sendFailed = signal<boolean>(false);
  public readonly uploadInProgress = signal<boolean>(false);

  constructor() {
    this.uiService.setConfig({
      header: {
        title: false,
        backNavigationButton: true,
      },
    });
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onSubmit(): void {
    this.sendFailed.set(false);

    this.ticketsService
      .sendVehicleBrandingPeriodTicket(this.ticket().id)
      .pipe(
        switchMap(() => this.navigateToSuccessScreen()),
        catchError((error) => {
          this.sendFailed.set(true);
          return throwError(() => error);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public canDeactivate(): boolean {
    return !this.uploadInProgress();
  }

  private navigateToSuccessScreen(): Observable<boolean> {
    return from(
      this.router.navigate([CorePaths.SUCCESS], {
        queryParams: { licensePlate: this.vehicle().license_plate },
        relativeTo: this.route,
      }),
    );
  }
}
