import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SafeUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { SliderIndicatorComponent } from '@ui/shared/components/slider-indicator/slider-indicator.component';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { Observable } from 'rxjs';

export interface PhotoGalleryData<T> {
  label: string;
  selectedPhotoData: { category: T; isJustUploaded: boolean; descriptionPath: string };
  categories: T[];
  photos$: Observable<{ category: T; data: { fallback_url: SafeUrl; url: SafeUrl } }[]>;
}

@Component({
  selector: 'upf-photo-gallery',
  standalone: true,
  imports: [
    AsyncPipe,
    LetDirective,
    NgClass,
    DefaultImgSrcDirective,
    TranslateModule,
    MatIconButton,
    MatIcon,
    SliderIndicatorComponent,
  ],
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoGalleryComponent<T> {
  constructor(
    private readonly dialogRef: MatDialogRef<PhotoGalleryComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public galleryData: PhotoGalleryData<T>,
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public onCloseClick(): void {
    this.dialogRef.close();
  }

  public onPreviousClick(): void {
    const index = this.galleryData.categories.indexOf(this.galleryData.selectedPhotoData.category);

    this.galleryData.selectedPhotoData.category =
      index - 1 < 0
        ? this.galleryData.categories[this.galleryData.categories.length - 1]
        : this.galleryData.categories[index - 1];
  }

  public onNextClick(): void {
    const index = this.galleryData.categories.indexOf(this.galleryData.selectedPhotoData.category);

    this.galleryData.selectedPhotoData.category =
      index + 1 === this.galleryData.categories.length
        ? this.galleryData.categories[0]
        : this.galleryData.categories[index + 1];
  }
}
