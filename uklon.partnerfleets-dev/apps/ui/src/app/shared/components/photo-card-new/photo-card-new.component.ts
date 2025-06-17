import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  HostBinding,
  Input,
  input,
  Optional,
  Output,
  Self,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SafeUrl } from '@angular/platform-browser';
import { TicketType } from '@constant';
import { PhotoType, UploadFileUrlDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { TicketFileUploadService } from '@ui/core/services/ticket-file-upload.service';
import { UIService } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import moment from 'moment';
import {
  BehaviorSubject,
  delay,
  distinctUntilChanged,
  finalize,
  interval,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
  throwError,
} from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.jp2', '.heic', '.heif'];
const MAX_FILE_SIZE_MB = 10;
const LAST_MODIFIED_DIFF_MIN = 15;
const DISPLAY_SUCCESS_SECONDS = 3;
const ERROR_MESSAGES = {
  size: 'Common.FileUpload.SizeError',
  extension: 'Common.FileUpload.ExtensionError',
  time: 'Common.FileUpload.TimeError',
  server: 'Common.FileUpload.UploadError',
} as const;
const PHOTO_CATEGORIES_PNG = new Set<PhotoType>(['vehicle_angled_front', 'vehicle_angled_back']);
const DEFAULT_PLACEHOLDER_PADDINGS_PX = [24, 36];
const PLACEHOLDER_PADDING_PX = new Map<PhotoType, [number, number]>([
  ['vehicle_angled_front', [16, 28]],
  ['vehicle_angled_back', [16, 28]],
  ['driver_license_front_copy', [12, 24]],
  ['driver_license_reverse_copy', [12, 24]],
  ['residence', [12, 24]],
  ['id_card_front', [12, 24]],
  ['id_card_reverse', [12, 24]],
]);

type ErrorMessage = (typeof ERROR_MESSAGES)[keyof typeof ERROR_MESSAGES];

interface ErrorMessageData<T = unknown> {
  message: ErrorMessage;
  data?: T;
}

@Component({
  selector: 'upf-photo-card-new',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatProgressSpinner,
    MatMiniFabButton,
    TranslateModule,
    MatIcon,
    LetDirective,
  ],
  templateUrl: './photo-card-new.component.html',
  styleUrl: './photo-card-new.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate(150, style({ opacity: 1 }))]),
      transition('* => void', [style({ opacity: 1 }), animate(150, style({ opacity: 0 }))]),
    ]),
  ],
})
export class PhotoCardNewComponent implements ControlValueAccessor {
  @Output() public photoClick = new EventEmitter<PhotoType>();
  @Output() public fileUploaded = new EventEmitter<void>();

  @Input() public set photoUrl(url: string | SafeUrl) {
    this.url.set(url as string);
  }

  @HostBinding('class.no-label')
  public get noLabel(): boolean {
    return this.hideLabel();
  }

  public category = input.required<PhotoType>();

  public ticketId = input<string>();
  public hideLabel = input<boolean>(false);
  public maxFileSizeMb = input<number>(MAX_FILE_SIZE_MB);
  public allowedExtensions = input<string[]>(ALLOWED_EXTENSIONS);
  public capture = input<'user' | 'environment' | null>(null);
  public ticketType = input<TicketType>(TicketType.VEHICLE_TO_FLEET_ADDITION);

  public readonly url = signal<string>('');
  public readonly uploading = signal<boolean>(false);
  public readonly errorMessages = signal<ErrorMessageData[]>([]);
  public readonly disabled = signal<boolean>(false);
  public readonly extension = computed(() => (PHOTO_CATEGORIES_PNG.has(this.category()) ? 'png' : 'svg'));
  public readonly isMobileView = toSignal<boolean>(this.uiService.breakpointMatch());
  public readonly padding = computed(() => {
    const [mobile, desktop] = PLACEHOLDER_PADDING_PX.get(this.category()) ?? DEFAULT_PLACEHOLDER_PADDINGS_PX;
    return this.isMobileView() ? mobile : desktop;
  });

  public readonly file$ = new BehaviorSubject<File | null>(null);
  public readonly uploadProgress$ = this.file$.pipe(
    filter(Boolean),
    switchMap(({ size }) => this.getUploadUrl(size)),
    shareReplay(1),
  );
  public readonly showSuccessInterval$ = interval(1000).pipe(
    startWith(0),
    takeWhile((iteration) => iteration < DISPLAY_SUCCESS_SECONDS + 1),
    map((iteration) => iteration !== DISPLAY_SUCCESS_SECONDS),
  );
  public uploadSuccess$ = this.uploadProgress$.pipe(
    filter((progress) => progress === 100),
    delay(300),
    tap(() => this.url.set(this.tempPhotoUrl)),
    switchMap(() => this.showSuccessInterval$),
  );

  private tempPhotoUrl!: string;

  constructor(
    protected readonly uiService: UIService,
    protected readonly ticketFileUploadService: TicketFileUploadService,
    @Self() @Optional() public formControl: NgControl,
  ) {
    if (!this.formControl) return;
    // eslint-disable-next-line no-param-reassign
    this.formControl.valueAccessor = this;
  }

  public get invalid(): boolean {
    if (!this.formControl) return false;

    const { invalid, touched, dirty } = this.formControl;
    return Boolean(invalid && (touched || dirty));
  }

  public onChange = (_: string): void => {};

  public onTouched = (): void => {};

  public registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  public writeValue(url: string): void {
    if (!url) return;
    this.url.set(url);
  }

  public onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);

    if (!file || !this.validateFile(file)) return;

    this.file$.next(file);
    target.value = '';
  }

  protected getUploadUrl(fileSize: number): Observable<number> {
    this.uploading.set(true);

    return this.ticketFileUploadService
      .getTicketImageUploadUrl(this.ticketId(), this.category(), fileSize, this.ticketType())
      .pipe(
        switchMap((config) => this.uploadImage(config)),
        catchError((error) => this.handleServerError(error)),
      );
  }

  protected uploadImage({ getUrl, uploadUrl }: UploadFileUrlDto): Observable<number> {
    const file = this.file$.getValue();
    if (!file) return of(0);

    return this.ticketFileUploadService.uploadFile(uploadUrl, file).pipe(
      catchError((error) => this.handleServerError(error)),
      map((event: HttpEvent<unknown>) => {
        let progress = 0;
        if (event.type === HttpEventType.UploadProgress && event.loaded && event.total) {
          progress = Math.round(100 * (event.loaded / event.total));
        }

        return progress;
      }),
      distinctUntilChanged(),
      tap((progress: number) => {
        if (progress < 100) return;
        this.tempPhotoUrl = getUrl;
        this.onChange(getUrl);
      }),
      finalize(() => {
        this.fileUploaded.emit();
        this.uploading.set(false);
      }),
    );
  }

  protected validateFile(file: File): boolean {
    const sizeBytes = this.maxFileSizeMb() * 1024 * 1024;
    const fileTypes = file.type.split('/');
    const extension = `.${fileTypes[fileTypes.length - 1]}`;
    const creationTimeDiff = moment().diff(moment(file.lastModified), 'minutes');
    const errors: ErrorMessageData[] = [];

    if (file.size > sizeBytes) {
      errors.push({ message: ERROR_MESSAGES.size, data: this.maxFileSizeMb() });
    }

    if (!this.allowedExtensions().includes(extension)) {
      errors.push({ message: ERROR_MESSAGES.extension });
    }

    if (this.capture() && creationTimeDiff > LAST_MODIFIED_DIFF_MIN) {
      errors.push({ message: ERROR_MESSAGES.time });
    }

    this.errorMessages.set(errors);

    if (errors.length === 0) return true;

    this.onTouched();
    return false;
  }

  protected handleServerError(error: HttpErrorResponse): Observable<never> {
    this.errorMessages.set([{ message: ERROR_MESSAGES.server }]);
    this.uploading.set(false);
    return throwError(() => error);
  }
}
