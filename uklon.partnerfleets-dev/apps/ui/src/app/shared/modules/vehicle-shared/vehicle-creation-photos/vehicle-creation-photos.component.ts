import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PhotoSize, TicketStatus, VehiclePhotosCategory } from '@constant';
import {
  AnalyticsAddingVehiclePhotos,
  FleetAnalyticsEventType,
  PhotosDto,
  PictureSafeUrlDto,
  VehicleTicketConfigDto,
  VehicleTicketImages,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesEffects } from '@ui/modules/vehicles/store';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import {
  getVehicleTicketPhotos,
  getVehicleTicketPhotosLg,
} from '@ui/modules/vehicles/store/vehicles/vehicles.selectors';
import { DotMarkerIconComponent } from '@ui/shared';
import { PhotoCardComponent } from '@ui/shared/components/photo-card/photo-card.component';
import { SelectedFileModel } from '@ui/shared/components/photo-card/selected-file.model';
import {
  ADDITIONAL_PHOTOS_CATEGORIES,
  INTERIOR_NEW_PHOTOS_CATEGORIES,
  REGISTRATION_PHOTOS_CATEGORIES,
  VEHICLE_NEW_PHOTOS_CATEGORIES,
} from '@ui/shared/consts';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { FleetRegion } from '@ui/shared/enums/fleet-regions.enum';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { IsEditPhotoCardPipe } from '@ui/shared/modules/vehicle-shared/pipes/is-edit-photo-card/is-edit-photo-card.pipe';
import { combineLatest, delay, merge, of, startWith, throwError } from 'rxjs';
import { catchError, filter, first, map, take, tap } from 'rxjs/operators';

type TicketPhotos = Record<string, { available: boolean; data: PictureSafeUrlDto }>;

interface PhotoData {
  category: VehiclePhotosCategory;
  isJustUploaded: boolean;
  descriptionPath: string;
}

@Component({
  selector: 'upf-vehicle-creation-photos',
  standalone: true,
  imports: [
    InfoPanelComponent,
    LetDirective,
    AsyncPipe,
    TranslateModule,
    IsEditPhotoCardPipe,
    DotMarkerIconComponent,
    MatCheckbox,
    NgTemplateOutlet,
    ReactiveFormsModule,
    PhotoCardComponent,
  ],
  templateUrl: './vehicle-creation-photos.component.html',
  styleUrls: ['./vehicle-creation-photos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCreationPhotosComponent implements OnInit {
  @Input() public regionId: number;
  @Input() public vehicleId: string;
  @Input() public ticketId: string;
  @Input() public ticketStatus: TicketStatus;
  @Input() public images: VehicleTicketImages;
  @Input() public isCreation = false;
  @Input() public isEdit = false;
  @Input() public hasBtnSend = true;
  @Input() public hasWarning = false;
  @Input() public isMobileView = false;
  @Input() public set additionalPictureTypes(photos: VehiclePhotosCategory[]) {
    this.additionalPhotoCategories = ADDITIONAL_PHOTOS_CATEGORIES.filter((category) => photos.includes(category));
  }

  @Input() public set ticketConfig(config: VehicleTicketConfigDto) {
    this.setPhotos(config?.required_picture_types);
  }

  @Output() public send = new EventEmitter<void>();
  @Output() public photosValid = new EventEmitter<boolean>();
  @Output() public insuranceConsentGiven = new EventEmitter<boolean>();
  @Output() public createTicket = new EventEmitter<void>();

  public readonly additionalDescriptionCategories = [
    VehiclePhotosCategory.DRIVER_TAXI_LICENSE_FRONT,
    VehiclePhotosCategory.DRIVER_TAXI_LICENSE_REVERSE,
    VehiclePhotosCategory.DRIVER_INSURANCE_FRONT,
  ];
  public driverRegistrationPhotoCategories: VehiclePhotosCategory[] = [];
  public vehicleNewPhotoCategories: VehiclePhotosCategory[] = [];
  public interiorPhotoCategories: VehiclePhotosCategory[] = [];
  public additionalPhotoCategories: VehiclePhotosCategory[] = [];
  public displayInsuranceCheckbox: boolean;

  public readonly insuranceControl = new FormControl<boolean>(false);
  public readonly smallPhotos$ = this.store.select(getVehicleTicketPhotos).pipe(filter(Boolean));
  public readonly largePhotos$ = this.store.select(getVehicleTicketPhotosLg).pipe(filter(Boolean));
  public readonly photos$ = merge(this.smallPhotos$, this.largePhotos$).pipe(
    map((photos) => this.mapPhotosToCategories(photos)),
  );

  public readonly isAllPhotosUploaded$ = combineLatest([
    this.photos$,
    this.insuranceControl.valueChanges.pipe(startWith(false)),
  ]).pipe(
    map(([photos, consentGiven]) => {
      const allPhotosUploaded = Object.keys(photos)?.length === this.categories?.length;
      const consent = this.displayInsuranceCheckbox ? consentGiven : true;
      this.insuranceConsentGiven.emit(allPhotosUploaded && consent);
      return allPhotosUploaded && consent;
    }),
    tap((valid) => this.photosValid.emit(valid)),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef,
    private readonly domSanitizer: DomSanitizer,
    private readonly ticketsService: TicketsService,
    private readonly store: Store<VehiclesState | AccountState>,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly vehiclesEffects: VehiclesEffects,
  ) {}

  public get categories(): VehiclePhotosCategory[] {
    return [
      ...this.driverRegistrationPhotoCategories,
      ...this.vehicleNewPhotoCategories,
      ...this.interiorPhotoCategories,
      ...this.additionalPhotoCategories,
    ];
  }

  public ngOnInit(): void {
    if (this.ticketId) {
      this.getVehicleTicketPhotos(PhotoSize.SMALL);
    }

    this.displayInsuranceCheckbox =
      (this.isCreation || this.ticketStatus === TicketStatus.DRAFT) && this.regionId !== FleetRegion.UZ;
  }

  public onPlaceholderClick(imgType: string): void {
    this.reportAnalyticUploadPhoto(FleetAnalyticsEventType.VEHICLES_ADDING_PHOTO_PLACEHOLDER_CLICK, imgType);
  }

  public onPhotoOpen(selectedPhotoData: PhotoData, photos: TicketPhotos): void {
    this.getVehicleTicketPhotos(PhotoSize.LARGE);

    const availableCategories = this.categories.filter(
      (category) => Object.prototype.hasOwnProperty.call(photos, category) && photos[category].available,
    );
    const dialogContainerParams = this.isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };

    this.largePhotos$.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe((photosLg) => {
      const photos$ = of(
        this.isCreation ? this.mapGalleryPhotos(photos) : this.mapGalleryPhotos(this.mapPhotosToCategories(photosLg)),
      );

      this.dialog.open(PhotoGalleryComponent, {
        ...dialogContainerParams,
        disableClose: false,
        restoreFocus: false,
        maxWidth: '768px',
        panelClass: 'mat-dialog-no-padding',
        data: {
          label: selectedPhotoData.descriptionPath,
          categories: availableCategories,
          selectedPhotoData,
          photos$,
        },
      });
    });
  }

  public onSendClick(): void {
    this.send.emit();
  }

  public onPhotoSelect(file: SelectedFileModel<VehiclePhotosCategory>): void {
    if (this.ticketId) {
      this.uploadPhoto(file);
    } else {
      this.createTicket.emit();

      this.vehiclesEffects.postFleetVehicleTicketByIdSuccess$.pipe(take(1)).subscribe(({ tiket_id }) => {
        this.ticketId = tiket_id;
        this.uploadPhoto(file);
      });
    }
  }

  private uploadPhoto(file: SelectedFileModel<VehiclePhotosCategory>): void {
    file.setLoadingStage('started');
    this.ticketsService
      .putVehicleTicketImage(this.ticketId, file.category, file.file)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error) => {
          file.setLoadingStage('failed');
          this.reportAnalyticUploadPhoto(FleetAnalyticsEventType.VEHICLES_ADDING_PHOTO_UPLOADED, file.category, error);
          return throwError(() => error);
        }),
        delay(1500),
      )
      .subscribe(() => {
        file.setLoadingStage('success');
        this.getVehicleTicketPhotos(PhotoSize.SMALL);
        this.reportAnalyticUploadPhoto(FleetAnalyticsEventType.VEHICLES_ADDING_PHOTO_UPLOADED, file.category);
      });
  }

  private getVehicleTicketPhotos(image_size: PhotoSize): void {
    this.store.dispatch(vehiclesActions.getVehicleTicketPhotos({ ticketId: this.ticketId, image_size }));
  }

  private setPhotos(requiredPhotos: VehiclePhotosCategory[]): void {
    const filterFn = (category: VehiclePhotosCategory): boolean => requiredPhotos?.includes(category);

    this.driverRegistrationPhotoCategories = REGISTRATION_PHOTOS_CATEGORIES.filter(filterFn);
    this.vehicleNewPhotoCategories = VEHICLE_NEW_PHOTOS_CATEGORIES.filter(filterFn);
    this.interiorPhotoCategories = INTERIOR_NEW_PHOTOS_CATEGORIES.filter(filterFn);
  }

  private sanitizeData(url: string, fallbackUrl: string): PictureSafeUrlDto {
    return {
      fallback_url: this.domSanitizer.bypassSecurityTrustUrl(fallbackUrl),
      url: this.domSanitizer.bypassSecurityTrustUrl(url),
    };
  }

  private mapPhotosToCategories(photos: PhotosDto): TicketPhotos {
    const categories = this.categories.filter((category) => Object.prototype.hasOwnProperty.call(photos, category));
    if (categories.length === 0) return {};

    return categories.reduce<TicketPhotos>((acc, category) => {
      return {
        ...acc,
        [category]: {
          available: true,
          data: this.sanitizeData(photos[category].url, photos[category].fallback_url),
        },
      };
    }, {});
  }

  private mapGalleryPhotos(
    photos: TicketPhotos,
  ): { category: string; data: { fallback_url: SafeUrl; url: SafeUrl } }[] {
    return Object.keys(photos).map((category) => ({
      category,
      data: { fallback_url: photos[category]?.data?.fallback_url, url: photos[category]?.data?.fallback_url },
    }));
  }

  private reportAnalyticUploadPhoto(event: FleetAnalyticsEventType, img_type: string, error?: unknown): void {
    this.analytics.reportEvent<AnalyticsAddingVehiclePhotos>(event, {
      user_access: this.storage.get(userRoleKey),
      ticket_id: this.ticketId,
      ticket_status: TicketStatus.DRAFT,
      img_type,
      error: error || '',
    });
  }
}
