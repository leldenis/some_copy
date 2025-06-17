import { Platform } from '@angular/cdk/platform';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, Inject, OnDestroy } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketStatus, TicketType, VehiclePhotoGroupCategory } from '@constant';
import {
  AnalyticsPhotoControlPhoto,
  AnalyticsPhotoControlScreen,
  FleetAnalyticsEventType,
  FleetVehicleOption,
  PhotosDto,
  PhotoType,
  TicketActivityLogItemDto,
  VehicleOptionDictionaryItemDto,
  VehiclePhotoControlTicketDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import {
  DotMarkerIconComponent,
  MAT_FORM_FIELD_IMPORTS,
  MAT_SELECT_IMPORTS,
  PhotoCardNewComponent,
  TicketStatusReasonsComponent,
  UIService,
} from '@ui/shared';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { PhotoCategoriesPipe } from '@ui/shared/modules/vehicle-shared/pipes/photo-categories/photo-categories.pipe';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { EMPTY, from, map, Observable, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Region } from '@uklon/types';

@Component({
  selector: 'upf-vehicle-photo-control-form',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    NgClass,
    TranslateModule,
    PhotoControlDeadlineMessagePipe,
    TicketStatusReasonsComponent,
    ReactiveFormsModule,
    PhotoCategoriesPipe,
    InfoPanelComponent,
    DotMarkerIconComponent,
    PhotoCardNewComponent,
    MatButton,
  ],
  templateUrl: './vehicle-photo-control-form.component.html',
  styleUrls: ['./vehicle-photo-control-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePhotoControlFormComponent implements OnDestroy {
  public readonly ticketStatus = TicketStatus;
  public readonly ticketType = TicketType;
  public readonly region = Region;
  public readonly photosGroup = VehiclePhotoGroupCategory;
  public readonly photosForm = new FormGroup({});
  public readonly optionsControl = new FormControl<FleetVehicleOption[]>([]);

  public readonly ticket = toSignal<VehiclePhotoControlTicketDto>(
    this.route.data.pipe(
      map(({ data: { ticket } }) => ticket),
      tap((ticket) => this.initForm(ticket)),
    ),
  );
  public readonly options = toSignal<VehicleOptionDictionaryItemDto[]>(
    this.route.data.pipe(map(({ data: { options } }) => options)),
  );
  public readonly clarificationReason = computed(() => {
    return (
      this.ticket()
        .activity_log.filter(({ status }) => status === TicketStatus.CLARIFICATION)
        .slice(-1) || []
    );
  });
  public readonly draftReason = computed(() => {
    return [
      {
        comment: this.ticket()?.reasons?.[0],
        clarification_details: { comment: this.ticket()?.reason_comment || '' },
      },
    ] as TicketActivityLogItemDto[];
  });

  constructor(
    private readonly uiService: UIService,
    private readonly ticketsService: TicketsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly platform: Platform,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
    private readonly destroyRef: DestroyRef,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    this.initShellConfig();
    this.reportPhotoControlScreen();
  }

  private get isMobileView(): boolean {
    return this.platform.ANDROID || this.platform.IOS;
  }

  private get analyticsProps(): AnalyticsPhotoControlPhoto {
    return {
      user_access: this.storage.get(userRoleKey),
      ticket_id: this.ticket().id,
      ticket_status: this.ticket().status,
      vehicle_id: this.ticket().vehicle_id,
      source: 'Web',
    };
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onSubmitTicket({ license_plate, vehicle_id, id }: VehiclePhotoControlTicketDto): void {
    this.analytics.reportEvent<AnalyticsPhotoControlScreen>(FleetAnalyticsEventType.FLEET_SUBMIT_PHOTO_CONTROL, {
      ...this.analyticsProps,
    });

    this.updateVehicleOptions()
      .pipe(
        switchMap(() => {
          return this.ticketsService.sendVehiclePhotoControlTicket(id).pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap(() => this.navigateToSuccessScreen(license_plate, vehicle_id)),
          );
        }),
      )
      .subscribe();
  }

  public onPhotoOpen(category: PhotoType): void {
    const photos = this.getGalleryPhotos();
    const dialogContainerParams = this.isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };

    this.dialog.open(PhotoGalleryComponent, {
      ...dialogContainerParams,
      disableClose: true,
      restoreFocus: false,
      maxWidth: '768px',
      panelClass: 'mat-dialog-no-padding',
      data: {
        label: 'Common.PhotoTypeFull.',
        categories: Object.keys(this.photosForm.value),
        selectedPhotoData: {
          category,
          descriptionPath: 'Common.PhotoTypeFull.',
        },
        photos$: of(photos),
      },
    });
  }

  public reportPlaceholderClick(category: PhotoType): void {
    if (this.photosForm.get(category).valid) return;

    this.analytics.reportEvent<AnalyticsPhotoControlPhoto>(
      FleetAnalyticsEventType.FLEET_PHOTO_CONTROL_IMG_PLACEHOLDER_CLICK,
      { ...this.analyticsProps, photo: category },
    );
  }

  public initForm({ picture_types, images, status, options }: VehiclePhotoControlTicketDto): void {
    picture_types.forEach((type) => {
      const url = images?.[type]?.url ?? '';
      this.photosForm.addControl(type, new FormGroup({ url: new FormControl(url, Validators.required) }));
    });
    this.optionsControl.patchValue(options ?? []);

    this.handleFormDisabling(status);
  }

  private handleFormDisabling(status: TicketStatus): void {
    if (status === TicketStatus.DRAFT || status === TicketStatus.CLARIFICATION) return;

    this.photosForm.disable();
  }

  private navigateToSuccessScreen(license_plate: string, vehicle_id: string): Observable<boolean> {
    return from(
      this.router.navigate(['success'], { queryParams: { license_plate, vehicle_id }, relativeTo: this.route }),
    );
  }

  private getGalleryPhotos(): { category: keyof PhotosDto; data: { url: string } }[] {
    return (Object.keys(this.photosForm.value) as PhotoType[])
      .filter((key) => this.photosForm.get(key).valid)
      .reduce<{ category: PhotoType; data: { url: string } }[]>((acc, type) => {
        const record = this.photosForm.value as Record<PhotoType, { url: string }>;
        return record[type] ? [...acc, { category: type, data: { url: record[type].url } }] : acc;
      }, []);
  }

  private reportPhotoControlScreen(): void {
    this.analytics.reportEvent<AnalyticsPhotoControlScreen>(FleetAnalyticsEventType.FLEET_PHOTO_CONTROL_SCREEN, {
      ...this.analyticsProps,
    });
  }

  private initShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
      },
    });
  }

  private updateVehicleOptions(): Observable<void> {
    return this.ticketsService
      .updateFleetVehiclePhotoControlTicket(this.ticket().id, this.optionsControl.getRawValue())
      .pipe(catchError(() => EMPTY));
  }
}
