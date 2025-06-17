import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PhotoSize, VehiclePhotosCategory } from '@constant';
import { FleetDto, PhotosDto, PhotoType } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import * as vehiclesSelectors from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { PhotoCardNewComponent } from '@ui/shared';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { Subject } from 'rxjs';
import { filter, tap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'upf-vehicle-photos',
  standalone: true,
  imports: [TranslateModule, PhotoCardNewComponent],
  templateUrl: './vehicle-photos.component.html',
  styleUrls: ['./vehicle-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePhotosComponent implements OnInit, OnDestroy {
  @Input() public fleet: FleetDto;
  @Input() public isMobileView: boolean;

  public driverRegistrationPhotoCategories = [
    VehiclePhotosCategory.DRIVER_REGISTRATION_FRONT,
    VehiclePhotosCategory.DRIVER_REGISTRATION_BACK,
  ];
  public driverInsurancePhotoCategories = [VehiclePhotosCategory.DRIVER_INSURANCE_FRONT];
  public vehiclePhotoCategories = [
    VehiclePhotosCategory.VEHICLE_ANGLED_FRONT,
    VehiclePhotosCategory.VEHICLE_ANGLED_BACK,
    VehiclePhotosCategory.VEHICLE_FRONT,
    VehiclePhotosCategory.VEHICLE_BACK,
    VehiclePhotosCategory.VEHICLE_LEFT,
    VehiclePhotosCategory.VEHICLE_RIGHT,
    VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
    VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
  ];
  public driverTaxiLicenses: VehiclePhotosCategory[] = [
    VehiclePhotosCategory.DRIVER_TAXI_LICENSE_FRONT,
    VehiclePhotosCategory.DRIVER_TAXI_LICENSE_REVERSE,
  ];

  public photos: Record<string, { available: boolean; data: { fallback_url: SafeUrl; url: SafeUrl } }> = {};

  public vehiclePhotos$ = this.vehiclesStore.select(vehiclesSelectors.getFleetVehiclePhotos);
  public vehiclePhotosLg$ = this.vehiclesStore.select(vehiclesSelectors.getFleetVehiclePhotosLg).pipe(
    filter((vehiclePhotos: PhotosDto) => !!vehiclePhotos),
    map((vehiclePhotos: PhotosDto) => {
      const photos: { category: VehiclePhotosCategory; data: { fallback_url: SafeUrl; url: SafeUrl } }[] = [];
      const categories = [
        ...this.driverRegistrationPhotoCategories,
        ...this.driverInsurancePhotoCategories,
        ...this.vehiclePhotoCategories,
        ...this.driverTaxiLicenses,
      ];
      categories.forEach((category: VehiclePhotosCategory) => {
        if (Object.prototype.hasOwnProperty.call(vehiclePhotos, category)) {
          photos.push({
            category,
            data: {
              fallback_url: this.domSanitizer.bypassSecurityTrustUrl(vehiclePhotos[category].fallback_url),
              url: this.domSanitizer.bypassSecurityTrustUrl(vehiclePhotos[category].url),
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
    private readonly vehiclesStore: Store<VehiclesState>,
    private readonly domSanitizer: DomSanitizer,
    private readonly cdr: ChangeDetectorRef,
    private readonly dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    const vehicleId = this.route.snapshot.paramMap.get('vehicleId');
    this.vehiclePhotos$
      .pipe(
        filter((vehiclePhotos: PhotosDto) => !!vehiclePhotos),
        tap((vehiclePhotos: PhotosDto) => {
          this.vehiclesStore.dispatch(
            vehiclesActions.getFleetVehiclePhotos({
              fleetId: this.fleet.id,
              vehicleId,
              image_size: PhotoSize.LARGE,
            }),
          );
          const categories = [
            ...this.driverRegistrationPhotoCategories,
            ...this.driverInsurancePhotoCategories,
            ...this.vehiclePhotoCategories,
            ...this.driverTaxiLicenses,
          ];
          categories.forEach((category: VehiclePhotosCategory) => {
            if (Object.prototype.hasOwnProperty.call(vehiclePhotos, category)) {
              this.photos[category] = {
                available: true,
                data: {
                  fallback_url: this.domSanitizer.bypassSecurityTrustUrl(vehiclePhotos[category].fallback_url),
                  url: this.domSanitizer.bypassSecurityTrustUrl(vehiclePhotos[category].url),
                },
              };
              this.cdr.markForCheck();
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
    const availableCategories = [
      ...this.driverRegistrationPhotoCategories,
      ...this.driverInsurancePhotoCategories,
      ...this.vehiclePhotoCategories,
      ...this.driverTaxiLicenses,
    ].filter((type) => Object.prototype.hasOwnProperty.call(this.photos, type) && this.photos[type].available);

    const dialogContainerParams = this.isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };

    this.dialog.open(PhotoGalleryComponent, {
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
        photos$: this.vehiclePhotosLg$,
      },
    });
  }
}
