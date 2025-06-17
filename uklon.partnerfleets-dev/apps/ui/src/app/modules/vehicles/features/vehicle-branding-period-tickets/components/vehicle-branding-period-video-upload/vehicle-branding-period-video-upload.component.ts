import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { ActivatedRoute } from '@angular/router';
import { UploadFileUrlDto, VehicleBrandingPeriodTicketDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { TicketFileUploadService } from '@ui/core';
import { ShowDeadlinePipe } from '@ui/modules/vehicles/features/vehicle-branding-period-tickets/pipes/show-deadline/show-deadline.pipe';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { toUploadProgress } from '@ui/shared';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EnvironmentModel } from '@ui-env/environment.model';
import {
  BehaviorSubject,
  distinctUntilChanged,
  finalize,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

import { APP_CONFIG, UklAngularCoreModule } from '@uklon/angular-core';

const ERROR_MESSAGES = {
  size: 'Common.FileUpload.SizeError',
  extension: 'Common.FileUpload.ExtensionError',
  server: 'Common.FileUpload.UploadError',
} as const;
const ALLOWED_MIME_TYPES = new Set(['mpeg', 'avi', 'mov', 'mp4', 'quicktime']);

@Component({
  selector: 'upf-vehicle-branding-period-video-upload',
  standalone: true,
  imports: [
    MatProgressBar,
    MatIcon,
    TranslateModule,
    AsyncPipe,
    MatFabButton,
    MatIconButton,
    UklAngularCoreModule,
    ShowDeadlinePipe,
    PhotoControlDeadlineMessagePipe,
  ],
  templateUrl: './vehicle-branding-period-video-upload.component.html',
  styleUrl: './vehicle-branding-period-video-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleBrandingPeriodVideoUploadComponent implements OnInit {
  public readonly appConfig = inject(APP_CONFIG) as EnvironmentModel;
  public readonly icons = inject(ICONS);
  public readonly destroyRef = inject(DestroyRef);
  public readonly route = inject(ActivatedRoute);
  public readonly ticketFileUploadService = inject(TicketFileUploadService);

  public readonly ticket = input.required<VehicleBrandingPeriodTicketDto | undefined>();
  public readonly monthlyCode = input.required<string>();

  public readonly fileUploaded = output<boolean>();
  public readonly uploadInProgress = output<boolean>();

  public readonly file$ = new BehaviorSubject<File | null>(null);
  public readonly uploadProgress$ = this.file$.pipe(
    filter(Boolean),
    switchMap((file) => this.getUploadUrl(file)),
    shareReplay(1),
  );

  public readonly uploading = signal<boolean>(false);
  public readonly cancelUpload = signal<boolean>(false);
  public readonly videoUrl = signal<string>('');
  public readonly errorMessage = signal<string>('');

  public readonly maxSizeMb = this.appConfig?.vehicleBrandingVideoMaxSizeMb ?? 100;
  public readonly allowedExtensions = ['.mpeg', '.avi', '.mov', '.mp4'];

  constructor() {
    effect(() => this.fileUploaded.emit(!!this.videoUrl()));
    effect(() => this.uploadInProgress.emit(this.uploading()));
  }

  public ngOnInit(): void {
    this.videoUrl.set(this.ticket().videos?.vehicle_branding_review?.url ?? '');
    this.fileUploaded.emit(!!this.videoUrl());
  }

  public onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);

    if (!file || !this.validateFile(file)) return;

    this.file$.next(file);
    this.uploading.set(true);
    target.value = '';
  }

  public onCancelUpload(): void {
    this.cancelUpload.set(true);
    this.file$.next(null);
  }

  public onDeleteVideo(): void {
    this.ticketFileUploadService
      .deleteVideo(this.ticket().id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.videoUrl.set('');
          this.fileUploaded.emit(!!this.videoUrl());
        }),
      )
      .subscribe();
  }

  private getUploadUrl({ size }: File): Observable<number> {
    return this.ticketFileUploadService.getTicketVideoUploadUrl(this.ticket().id, size).pipe(
      switchMap((config) => this.uploadFile(config)),
      startWith(0),
      catchError((error) => this.handleServerError(error)),
    );
  }

  private uploadFile({ uploadUrl, getUrl }: UploadFileUrlDto): Observable<number> {
    this.cancelUpload.set(false);
    const file = this.file$.getValue();
    if (!file) return of(0);

    return this.ticketFileUploadService.uploadFile(uploadUrl, file).pipe(
      catchError((error) => this.handleServerError(error)),
      toUploadProgress(),
      distinctUntilChanged(),
      finalize(() => {
        if (!this.cancelUpload()) {
          this.videoUrl.set(getUrl);
          this.fileUploaded.emit(!!this.videoUrl());
        }
        this.uploading.set(false);
      }),
      // eslint-disable-next-line rxjs/no-ignored-takewhile-value
      takeWhile(() => !this.cancelUpload()),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private validateFile(file: File): boolean {
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

    this.errorMessage.set(error);
    return !error;
  }

  private handleServerError(error: HttpErrorResponse): Observable<never> {
    this.errorMessage.set(ERROR_MESSAGES.server);
    this.uploading.set(false);
    return throwError(() => error);
  }
}
