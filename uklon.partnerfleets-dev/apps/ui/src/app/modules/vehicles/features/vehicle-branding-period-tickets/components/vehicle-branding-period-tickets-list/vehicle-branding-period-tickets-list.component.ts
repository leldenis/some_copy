import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TicketStatus } from '@constant';
import { UploadFileUrlDto, VehicleBrandingPeriodTicketItemDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { TicketFileUploadService } from '@ui/core/services';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { VehicleBrandingPeriodListUploadComponent } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/components/vehicle-branding-period-list-upload/vehicle-branding-period-list-upload.component';
import { ShowDeadlinePipe } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/pipes/show-deadline/show-deadline.pipe';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { StatusBadgeComponent, toUploadProgress } from '@ui/shared';
import { PHOTO_CONTROL_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel } from '@ui-env/environment.model';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import {
  catchError,
  distinctUntilChanged,
  finalize,
  Observable,
  of,
  retry,
  startWith,
  Subscription,
  switchMap,
  throwError,
  timer,
} from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { APP_CONFIG } from '@uklon/angular-core';

const ALLOWED_MIME_TYPES = new Set(['mpeg', 'avi', 'mov', 'mp4', 'quicktime']);

export interface UploadState {
  errorMessage: WritableSignal<string>;
  uploadProgress: WritableSignal<number>;
  uploadSuccess: WritableSignal<boolean>;
  pending: WritableSignal<boolean>;
}

const ERROR_MESSAGES = {
  size: 'Common.FileUpload.SizeError',
  extension: 'Common.FileUpload.ExtensionError',
  server: 'Common.FileUpload.UploadError',
} as const;

@Component({
  selector: 'upf-vehicle-branding-period-tickets-list',
  standalone: true,
  imports: [
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    TranslateModule,
    MatDivider,
    MatIcon,
    PhotoControlDeadlineMessagePipe,
    StatusBadgeComponent,
    RouterLink,
    NgxTippyModule,
    VehicleBrandingPeriodListUploadComponent,
    ShowDeadlinePipe,
    NgTemplateOutlet,
  ],
  templateUrl: './vehicle-branding-period-tickets-list.component.html',
  styleUrl: './vehicle-branding-period-tickets-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodTicketsListComponent implements OnInit, OnDestroy {
  public readonly appConfig = inject(APP_CONFIG) as EnvironmentModel;
  public readonly destroyRef = inject(DestroyRef);
  public readonly ticketFileUploadService = inject(TicketFileUploadService);
  public readonly ticketsService = inject(TicketsService);
  public readonly selectedFleet$ = inject(Store<AccountState>)
    .select(getSelectedFleet)
    .pipe(
      filter(Boolean),
      tap(() => this.deleteSubscriptions()),
      takeUntilDestroyed(this.destroyRef),
    );

  public readonly uploadFileCount = output<number>();
  public readonly ticketSent = output<string>();
  public readonly tickets = input.required<VehicleBrandingPeriodTicketItemDto[]>();
  public readonly isMobileView = input.required<boolean>();
  public readonly monthlyCode = input<string>('');

  public readonly uploadMap = new Map<string, UploadState>();
  public readonly subscriptionsMap = new Map<string, Subscription>();
  public readonly corePaths = CorePaths;
  public readonly vehiclePaths = VehiclePaths;
  public readonly statusColor = PHOTO_CONTROL_TICKET_STATUS_COLOR;
  public readonly ticketStatus = TicketStatus;
  public readonly icons = inject(ICONS);
  public readonly maxSizeMb = this.appConfig?.vehicleBrandingVideoMaxSizeMb ?? 100;
  public readonly allowedExtensions = ['.mpeg', '.avi', '.mov', '.mp4'];

  public ngOnInit(): void {
    this.selectedFleet$.subscribe(() => this.deleteSubscriptions());
  }

  public ngOnDestroy(): void {
    this.deleteSubscriptions();
  }

  public onFileSelect({ ticketId, file }: { ticketId: string; file: File }): void {
    this.uploadMap.set(ticketId, {
      uploadProgress: signal(0),
      errorMessage: signal(''),
      uploadSuccess: signal(false),
      pending: signal(false),
    });

    if (!file || !this.validateFile(file, ticketId)) return;

    this.subscriptionsMap.set(ticketId, this.getUploadUrl(ticketId, file).subscribe());
    this.uploadFileCount.emit(this.subscriptionsMap.size);
  }

  public onCancelUpload(ticketId: string): void {
    this.subscriptionsMap.get(ticketId).unsubscribe();
    this.subscriptionsMap.delete(ticketId);
    this.uploadMap.delete(ticketId);
  }

  private getUploadUrl(ticketId: string, file: File): Observable<number> {
    return this.ticketFileUploadService.getTicketVideoUploadUrl(ticketId, file.size).pipe(
      switchMap((config) => this.uploadFile(config, file)),
      startWith(0),
      tap((progress) => {
        this.uploadMap.get(ticketId).uploadProgress.set(progress);
        if (progress === 100) this.sendTicket(ticketId);
      }),
      finalize(() => {
        this.subscriptionsMap.delete(ticketId);
        this.uploadFileCount.emit(this.subscriptionsMap.size);
      }),
      catchError((error) => this.handleServerError(error, ticketId)),
    );
  }

  private uploadFile({ uploadUrl }: UploadFileUrlDto, file: File): Observable<number> {
    if (!file) return of(0);

    return this.ticketFileUploadService.uploadFile(uploadUrl, file).pipe(toUploadProgress(), distinctUntilChanged());
  }

  private sendTicket(ticketId: string): void {
    this.uploadMap.get(ticketId).pending.set(true);

    this.ticketsService
      .sendVehicleBrandingPeriodTicket(ticketId)
      .pipe(
        tap(() => {
          this.uploadMap.get(ticketId).uploadSuccess.set(true);
          this.uploadMap.get(ticketId).pending.set(false);
        }),
        retry({
          count: 3,
          delay: (error: HttpErrorResponse) => {
            return error.status === HttpStatusCode.BadRequest ? timer(500) : throwError(() => error);
          },
        }),
        catchError((error) => this.handleServerError(error, ticketId)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.ticketSent.emit(ticketId));
  }

  private deleteSubscriptions(): void {
    this.subscriptionsMap.forEach((subscription: Subscription) => subscription.unsubscribe());
    this.subscriptionsMap.clear();
    this.uploadMap.clear();
  }

  private validateFile(file: File, ticketId: string): boolean {
    const sizeBytes = this.maxSizeMb * 1024 * 1024;
    const split = file.type.split('/');
    const extension = `${split[split.length - 1]}`;
    let error: string;

    if (file.size > sizeBytes) {
      error = ERROR_MESSAGES.size;
    }

    if (!ALLOWED_MIME_TYPES.has(extension)) {
      error = ERROR_MESSAGES.extension;
    }

    this.uploadMap.get(ticketId).errorMessage.set(error);
    return !error;
  }

  private handleServerError(error: HttpErrorResponse, ticketId: string): Observable<never> {
    this.uploadMap.get(ticketId).errorMessage.set(ERROR_MESSAGES.server);
    return throwError(() => error);
  }
}
