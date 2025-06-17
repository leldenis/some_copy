import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TicketStatus } from '@constant';
import { VehicleBrandingPeriodDto, VehicleBrandingPeriodTicketDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { PHOTO_CONTROL_STATUS_STYLING } from '@ui/modules/vehicles/consts';
import { UploadVehicleBrandingVideoDialogComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/dialogs';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { PanelStylingPipe } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import {
  InfoPanelIconDirective,
  InfoPanelSubtitleDirective,
  InfoPanelTitleDirective,
} from '@ui/shared/modules/info-panel/directives';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { forkJoin, from, Observable, switchMap } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-vehicle-branding-period-panel',
  standalone: true,
  imports: [
    CommonModule,
    PanelStylingPipe,
    MatIcon,
    TranslateModule,
    PhotoControlDeadlineMessagePipe,
    MatButton,
    InfoPanelComponent,
    InfoPanelIconDirective,
    InfoPanelTitleDirective,
    InfoPanelSubtitleDirective,
  ],
  templateUrl: './vehicle-branding-period-panel.component.html',
  styleUrl: './vehicle-branding-period-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodPanelComponent {
  public brandingPeriod = input.required<VehicleBrandingPeriodDto>();
  public licensePlate = input.required<string>();
  public isMobileView = input.required<boolean>();

  public ticketSent = output();

  public readonly clarificationStatusStyling = PHOTO_CONTROL_STATUS_STYLING[TicketStatus.DRAFT];
  public readonly status = computed(() => this.brandingPeriod().status);
  public readonly showStatusDescription = computed(() =>
    [TicketStatus.REJECTED, TicketStatus.SENT, TicketStatus.REVIEW].includes(this.status()),
  );
  public readonly showDeadline = computed(
    () => [TicketStatus.DRAFT].includes(this.status()) && this.brandingPeriod().deadline_to_send,
  );
  public readonly deadline = computed(() =>
    this.photoControlDeadlineMessagePipe.transform(this.brandingPeriod().deadline_to_send),
  );
  public readonly showDetailsPanel = computed(
    () =>
      this.status() === TicketStatus.CLARIFICATION ||
      ([TicketStatus.DRAFT, TicketStatus.REJECTED].includes(this.status()) && !this.deadline().passedDeadline),
  );

  public readonly ticketStatus = TicketStatus;

  public readonly icons = inject(ICONS);

  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly photoControlDeadlineMessagePipe = inject(PhotoControlDeadlineMessagePipe);
  private readonly ticketsService = inject(TicketsService);
  private readonly router = inject(Router);

  public onOpenVehicleBrandingPeriodDialog(): void {
    if (this.isMobileView()) {
      this.getData()
        .pipe(
          switchMap(({ ticket, code }) => this.navigateToBrandingControlPage(ticket, code)),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();

      return;
    }

    this.getData()
      .pipe(
        switchMap(({ ticket, code }) => this.opnVehicleBrandingPeriodDialog(ticket, code)),
        tap(() => this.ticketSent.emit()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private getData(): Observable<{ ticket: VehicleBrandingPeriodTicketDto; code: string }> {
    return forkJoin([
      this.ticketsService.getVehicleBrandingPeriodTicket(this.brandingPeriod().ticket_id),
      this.ticketsService.getVehicleBrandingMonthlyCode(),
    ]).pipe(map(([ticket, code]) => ({ ticket, code })));
  }

  private navigateToBrandingControlPage(
    ticket: VehicleBrandingPeriodTicketDto,
    monthlyCode: string,
  ): Observable<boolean> {
    return from(
      this.router.navigate(
        [CorePaths.WORKSPACE, CorePaths.VEHICLES, ticket.vehicle, VehiclePaths.BRANDING_PERIOD_CONTROL, ticket.id],
        { queryParams: { monthlyCode } },
      ),
    );
  }

  private opnVehicleBrandingPeriodDialog(ticket: VehicleBrandingPeriodTicketDto, code: string): Observable<boolean> {
    return this.dialog
      .open(UploadVehicleBrandingVideoDialogComponent, {
        disableClose: true,
        data: { ticket, code, licensePlate: this.licensePlate() },
      })
      .afterClosed()
      .pipe(filter(Boolean));
  }
}
