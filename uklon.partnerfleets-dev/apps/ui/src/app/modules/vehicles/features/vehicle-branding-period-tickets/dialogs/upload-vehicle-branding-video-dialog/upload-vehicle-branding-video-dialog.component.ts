import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TicketStatus } from '@constant';
import { TicketActivityLogItemDto, VehicleBrandingPeriodTicketDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { VehicleBrandingPeriodVideoUploadComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/components';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { TicketStatusReasonsComponent } from '@ui/shared';
import { retry, throwError, timer } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface DialogData {
  ticket: VehicleBrandingPeriodTicketDto;
  code: string;
  licensePlate: string;
}

enum DialogState {
  FORM,
  SUCCESS,
  CANCEL,
}

@Component({
  selector: 'upf-upload-vehicle-branding-video-dialog',
  standalone: true,
  imports: [
    CommonModule,
    VehicleBrandingPeriodVideoUploadComponent,
    MatIcon,
    MatIconButton,
    TranslateModule,
    TicketStatusReasonsComponent,
    MatButton,
  ],
  templateUrl: './upload-vehicle-branding-video-dialog.component.html',
  styleUrl: './upload-vehicle-branding-video-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadVehicleBrandingVideoDialogComponent implements OnInit {
  public readonly data: DialogData = inject(MAT_DIALOG_DATA);

  public readonly ticketStatus = TicketStatus;
  public readonly dialogState = DialogState;

  public readonly state = signal<DialogState>(DialogState.FORM);
  public readonly clarificationReason = signal<TicketActivityLogItemDto[]>([]);
  public readonly fileUploaded = signal<boolean>(false);
  public readonly uploadInProgress = signal<boolean>(false);
  public readonly sendFailed = signal<boolean>(false);

  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly ticketsService = inject(TicketsService);

  constructor() {
    effect(
      () => {
        if (!this.uploadInProgress() && this.state() === DialogState.CANCEL) {
          this.state.set(DialogState.FORM);
        }
      },
      { allowSignalWrites: true },
    );
  }

  public ngOnInit(): void {
    this.clarificationReason.set(
      this.data.ticket.activity_log.filter(({ status }) => status === TicketStatus.CLARIFICATION).slice(-1) || [],
    );
  }

  public onSubmit(): void {
    this.sendFailed.set(false);

    this.ticketsService
      .sendVehicleBrandingPeriodTicket(this.data.ticket.id)
      .pipe(
        tap(() => this.state.set(DialogState.SUCCESS)),
        retry({
          count: 3,
          delay: (error: HttpErrorResponse) => {
            return error.status === HttpStatusCode.BadRequest ? timer(500) : throwError(() => error);
          },
        }),
        catchError((error) => {
          this.sendFailed.set(true);
          return throwError(() => error);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onCloseDialog(): void {
    if (!this.uploadInProgress()) {
      this.dialogRef.close(this.state() === DialogState.SUCCESS);
      return;
    }

    this.state.set(DialogState.CANCEL);
  }

  public onCancelUpload(cancel: boolean): void {
    cancel ? this.dialogRef.close() : this.state.set(DialogState.FORM);
  }
}
