import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { SelectedFileModel } from '@ui/shared/components/photo-card/selected-file.model';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

enum UploadResult {
  SUCCESS = 'success',
  FAILED = 'failed',
}

// should png placeholders on ios devices
const PHOTO_CATEGORIES_PNG = new Set(['vehicle_angled_front', 'vehicle_angled_back']);

@Component({
  selector: 'upf-photo-card',
  standalone: true,
  imports: [MatIcon, MatProgressSpinner, InfoPanelComponent, TranslateModule, MatMenuModule, DefaultImgSrcDirective],
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoCardComponent<T extends string> implements OnDestroy, OnChanges {
  private static ID_COUNTER = 0;

  @Input() public defaultPlaceholder: string;
  @Input() public category: T;
  @Input() public photoUrl: SafeUrl;
  @Input() public defaultPhotoUrl: SafeUrl;
  @Input() public isCreation = false;
  @Input() public isEdit = false;
  @Input() public descriptionPath = 'Vehicles.Details.Photos.Categories.';
  @Input() public hasWarning = false;
  @Input() public capture: 'user' | 'environment' = null;
  @Output() public open = new EventEmitter<{ category: T; isJustUploaded: boolean; descriptionPath: string }>();
  @Output() public selectFile = new EventEmitter<SelectedFileModel<T>>();
  @Output() public selectError = new EventEmitter<{ extensions: string; size: number }>();
  @Output() public placeholderClick = new EventEmitter<string>();

  public uploadResultRef = UploadResult;
  public uploadResult: UploadResult;

  public fileInputId = `fileInput${PhotoCardComponent.incrementCounter()}`;
  public allowedExtensions = ['.png', '.jpg', '.jpeg', '.jp2', '.heic', '.heif'];
  public maxFileSizeInMb = 10;

  public inProgress = false;
  public isJustUploaded = false;

  public placeholderStyles: SafeStyle;

  public fileSizeErrorMsg = '';

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly domSanitizer: DomSanitizer,
  ) {}

  public ngOnChanges({ defaultPlaceholder, category }: SimpleChanges): void {
    if ((defaultPlaceholder && this.defaultPlaceholder) || (category && this.category)) {
      const fileExtension = PHOTO_CATEGORIES_PNG.has(this.category) ? 'png' : 'svg';
      const placeholderUrl = `${this.defaultPlaceholder || this.category}.${fileExtension}`;
      this.placeholderStyles = this.domSanitizer.bypassSecurityTrustStyle(`url('/assets/images/${placeholderUrl}')`);
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onImageClick(): void {
    if (this.inProgress) {
      return;
    }
    this.open.emit({
      category: this.category,
      isJustUploaded: this.isJustUploaded,
      descriptionPath: this.descriptionPath,
    });
  }

  public onSelectImage(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.item(0);

    this.fileSizeErrorMsg = '';

    if (file && file.size > this.maxFileSizeInMb * 1024 * 1024) {
      this.fileSizeErrorMsg = 'Modals.PhotoCard.SizeError';
      return;
    }

    if (!this.uploadResult) {
      // eslint-disable-next-line unicorn/prefer-spread
      let files = Array.from(target.files);
      files = this.filterFiles(files);
      this.uploadFiles(files);
    }

    target.value = '';
  }

  public onPlaceholderClick(): void {
    this.placeholderClick.emit(this.category);
  }

  private filterFiles(files: File[]): File[] {
    if (files) {
      return files
        .filter((file) => file.size <= this.maxFileSizeInMb * 1024 * 1024)
        .filter((file) => {
          const name = file.name.toLowerCase();
          return this.allowedExtensions.some((item) => name.lastIndexOf(item) + item.length === name.length);
        });
    }

    return [];
  }

  private uploadFiles(files: File[]): void {
    if (files && files.length > 0) {
      this.selectFile.emit({
        category: this.category,
        file: files[0],
        setLoadingStage: (state) => {
          // eslint-disable-next-line default-case
          switch (state) {
            case 'started':
              this.resetUploadValues();
              break;
            case 'success':
              this.updateUploadResult(UploadResult.SUCCESS);
              break;
            case 'failed':
              this.updateUploadResult(UploadResult.FAILED);
              break;
          }
        },
      });
    } else {
      this.selectError.emit({
        extensions: this.allowedExtensions.join(','),
        size: Math.round(this.maxFileSizeInMb),
      });
    }
  }

  private resetUploadValues(): void {
    this.inProgress = true;
    this.changeDetectorRef.markForCheck();
  }

  private updateUploadResult(result: UploadResult): void {
    this.inProgress = false;
    this.uploadResult = result;
    this.isJustUploaded = true;
    this.changeDetectorRef.markForCheck();

    timer(3000)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.uploadResult = null;
        this.changeDetectorRef.markForCheck();
      });
  }

  private static incrementCounter(): number {
    PhotoCardComponent.ID_COUNTER += 1;
    return PhotoCardComponent.ID_COUNTER;
  }
}
