import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DriverPhotosCategory, PhotoSize } from '@constant';
import { FleetDto, PhotosDto, PhotoType } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ADDITIONAL_DRIVER_INFO_REGIONS } from '@ui/modules/drivers/consts';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import * as driversSelectors from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { PhotoCardNewComponent } from '@ui/shared';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'upf-driver-photos',
  standalone: true,
  imports: [TranslateModule, PhotoCardNewComponent],
  templateUrl: './driver-photos.component.html',
  styleUrls: ['./driver-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPhotosComponent implements OnInit, OnDestroy {
  @Input() public selectedFleet: FleetDto;
  @Input() public isMobileView = false;

  public readonly additionalDriverInfoRegions = ADDITIONAL_DRIVER_INFO_REGIONS;
  public driverLicenseCategories = [DriverPhotosCategory.LICENSE_FRONT, DriverPhotosCategory.LICENSE_REVERSE];
  public driverResidenceCategories = [DriverPhotosCategory.RESIDENCE];
  public idCardCategories = [DriverPhotosCategory.ID_CARD_FRONT, DriverPhotosCategory.ID_CARD_REVERSE];
  public photos: Record<string, { available: boolean; data: { fallback_url: SafeUrl; url: SafeUrl } }> = {};
  public driverPhotos$ = this.driversStore.select(driversSelectors.getFleetDriverPhotos);
  public driverPhotosLg$ = this.driversStore.select(driversSelectors.getFleetDriverPhotosLg).pipe(
    filter(Boolean),
    map((driverPhotos: PhotosDto) => {
      const photos: { category: DriverPhotosCategory; data: { fallback_url: SafeUrl; url: SafeUrl } }[] = [];
      const categories = [...this.driverLicenseCategories, ...this.driverResidenceCategories, ...this.idCardCategories];
      categories.forEach((category: DriverPhotosCategory) => {
        if (Object.prototype.hasOwnProperty.call(driverPhotos, category)) {
          photos.push({
            category,
            data: {
              fallback_url: this.domSanitizer.bypassSecurityTrustUrl(driverPhotos[category].fallback_url),
              url: this.domSanitizer.bypassSecurityTrustUrl(driverPhotos[category].url),
            },
          });
        }
      });
      return photos;
    }),
  );
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly driversStore: Store<DriversState>,
    private readonly domSanitizer: DomSanitizer,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly matDialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const driverId = this.route.snapshot.paramMap.get('driverId');
    this.driversStore.dispatch(
      driversActions.getFleetDriverPhotos({
        driverId,
        image_size: PhotoSize.SMALL,
      }),
    );

    this.driverPhotos$
      .pipe(
        filter((driverPhotos) => !!driverPhotos),
        tap((driverPhotos: PhotosDto) => {
          this.driversStore.dispatch(
            driversActions.getFleetDriverPhotos({
              driverId,
              image_size: PhotoSize.LARGE,
            }),
          );
          const categories = [
            ...this.driverLicenseCategories,
            ...this.driverResidenceCategories,
            ...this.idCardCategories,
          ];
          categories.forEach((category: DriverPhotosCategory) => {
            if (Object.prototype.hasOwnProperty.call(driverPhotos, category)) {
              this.photos[category] = {
                available: true,
                data: {
                  fallback_url: this.domSanitizer.bypassSecurityTrustUrl(driverPhotos[category].fallback_url),
                  url: this.domSanitizer.bypassSecurityTrustUrl(driverPhotos[category].url),
                },
              };
              this.changeDetectorRef.markForCheck();
            }
          });
        }),
        takeUntil(this.destroyed$),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public onPhotoOpen(category: PhotoType): void {
    const availableCategories = [...this.driverLicenseCategories, ...this.driverResidenceCategories].filter(
      (type) => Object.prototype.hasOwnProperty.call(this.photos, type) && this.photos[type].available,
    );

    const dialogContainerParams = this.isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };

    this.matDialog.open(PhotoGalleryComponent, {
      ...dialogContainerParams,
      disableClose: true,
      restoreFocus: false,
      maxWidth: '768px',
      panelClass: 'mat-dialog-no-padding',
      data: {
        label: 'Common.PhotoTypeFull.',
        categories: availableCategories,
        selectedPhotoData: {
          category,
          descriptionPath: 'Common.PhotoTypeFull.',
        },
        photos$: this.driverPhotosLg$,
      },
    });
  }
}
