import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DriverPhotosCategory, PhotoSize } from '@constant';
import { PhotosDto, PhotoType, PictureUrlDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { PhotoCardNewComponent } from '@ui/shared';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { Observable, map, share } from 'rxjs';

@Component({
  selector: 'upf-courier-photos',
  standalone: true,
  imports: [AsyncPipe, TranslateModule, PhotoCardNewComponent],
  templateUrl: './courier-photos.component.html',
  styleUrls: ['./courier-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierPhotosComponent implements OnInit {
  @Input() public isMobileView = false;
  @Input() public courierId: string;

  public idCardCategories = [DriverPhotosCategory.ID_CARD_FRONT, DriverPhotosCategory.ID_CARD_REVERSE];
  public courierPhotos$: Observable<PhotosDto>;

  constructor(
    private readonly matDialog: MatDialog,
    private readonly couriersService: CouriersService,
  ) {}

  public ngOnInit(): void {
    this.courierPhotos$ = this.couriersService.getCourierPhotos(this.courierId, PhotoSize.LARGE).pipe(share());
  }

  public onPhotoOpen(category: PhotoType): void {
    const dialogContainerParams = this.isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };

    this.matDialog.open(PhotoGalleryComponent, {
      ...dialogContainerParams,
      disableClose: true,
      restoreFocus: false,
      maxWidth: '768px',
      panelClass: 'mat-dialog-no-padding',
      data: {
        label: 'Common.PhotoTypeFull.',
        categories: this.idCardCategories,
        selectedPhotoData: {
          category,
          descriptionPath: 'Common.PhotoTypeFull.',
        },
        photos$: this.courierPhotos$.pipe(map((photos) => this.photosToArray(photos))),
      },
    });
  }

  private photosToArray(courierPhotos: PhotosDto): { category: DriverPhotosCategory; data: PictureUrlDto }[] {
    return (Object.keys(courierPhotos) as DriverPhotosCategory[]).reduce(
      (acc, category) => [...acc, { category, data: courierPhotos[category] }],
      [],
    );
  }
}
