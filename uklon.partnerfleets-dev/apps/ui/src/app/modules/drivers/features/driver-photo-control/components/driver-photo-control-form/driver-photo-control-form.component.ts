import { AsyncPipe, Location, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  DRIVER_PHOTO_GROUP_BY_CATEGORY,
  DriverPhotoGroupCategory,
  DriverPhotosCategory,
  TicketStatus,
  TicketType,
} from '@constant';
import {
  DriverPhotoControlTicketDto,
  FleetAnalyticsEventType,
  FleetDriverDto,
  PhotoType,
  TicketActivityLogItemDto,
} from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService } from '@ui/core/services/storage.service';
import { ToastService } from '@ui/core/services/toast.service';
import { DriverAvatarControlComponent } from '@ui/modules/drivers/features/driver-photo-control/components/driver-avatar-control/driver-avatar-control.component';
import { DriverPhotoControlService } from '@ui/modules/drivers/services/driver-photo-control.service';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { PhotoCardNewComponent, TicketStatusReasonsComponent, UIService } from '@ui/shared';
import { PhotoGalleryComponent } from '@ui/shared/dialogs/photo-gallery/photo-gallery.component';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { PhotoCategoriesPipe } from '@ui/shared/modules/vehicle-shared/pipes/photo-categories/photo-categories.pipe';
import { of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

const LAYOUT = [
  {
    categories: [DriverPhotoGroupCategory.AVATAR],
    title: 'Common.PhotoType.driver_avatar_photo',
  },
  {
    categories: [DriverPhotoGroupCategory.LICENSE],
    title: 'DriverPhotoControl.DriverLicenseTitle',
  },
  {
    categories: [DriverPhotoGroupCategory.RESIDENCE],
    title: 'Common.PhotoType.residence',
  },
  {
    categories: [DriverPhotoGroupCategory.COMBAT_CERTIFICATE],
    title: 'Common.PhotoType.combatant_status_certificate',
  },
  {
    categories: [DriverPhotoGroupCategory.CRIMINAL_RECORD_CERTIFICATE],
    title: 'Common.PhotoType.criminal_record_certificate',
  },
  {
    categories: [DriverPhotoGroupCategory.ID_CARD],
    title: 'DriverPhotoControl.PassportTitle',
  },
];

@Component({
  selector: 'upf-driver-photo-control-form',
  standalone: true,
  imports: [
    TranslateModule,
    NgTemplateOutlet,
    TicketStatusReasonsComponent,
    ReactiveFormsModule,
    InfoPanelComponent,
    PhotoCategoriesPipe,
    DriverAvatarControlComponent,
    PhotoCardNewComponent,
    AsyncPipe,
    PhotoControlDeadlineMessagePipe,
    NgClass,
    MatButton,
  ],
  templateUrl: './driver-photo-control-form.component.html',
  styleUrl: './driver-photo-control-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverPhotoControlFormComponent implements OnInit, OnDestroy {
  public readonly route = inject(ActivatedRoute);
  public readonly photosForm = new FormGroup({});
  public readonly isMobileView$ = this.uiService.breakpointMatch();
  public readonly ticket = toSignal<DriverPhotoControlTicketDto>(
    this.route.data.pipe(
      filter(Boolean),
      map(({ data: { ticket } }) => ticket),
      tap((ticket) => this.initForm(ticket)),
    ),
  );
  public readonly driver = toSignal<FleetDriverDto>(
    this.route.data.pipe(
      filter(Boolean),
      map(({ data: { driver } }) => driver),
    ),
  );
  public readonly fullName = computed(() => {
    return `${this.driver().last_name} ${this.driver().first_name}`;
  });
  public clarificationReason = computed(() => {
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
        clarification_details: {
          comment: this.ticket()?.reason_comment || '',
        },
      },
    ] as TicketActivityLogItemDto[];
  });
  public readonly ticketStatus = TicketStatus;
  public readonly ticketType = TicketType;
  public readonly photoCategory = DriverPhotosCategory;
  public readonly layout = LAYOUT;

  constructor(
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly uiService: UIService,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly driverPhotoControlService: DriverPhotoControlService,
    private readonly analytics: AnalyticsService,
    private readonly storage: StorageService,
  ) {
    this.initShellConfig();
  }

  public ngOnInit(): void {
    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_SCREEN);
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
  }

  public onSubmitForm(ticketId: string): void {
    this.driverPhotoControlService
      .sendDriverPhotoControlTicket(ticketId)
      .pipe(
        tap(() => {
          this.toastService.success(this.translateService.instant('PhotoControl.Form.SuccessTitle'));
          this.location.back();
        }),
      )
      .subscribe();

    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_TICKET_SEND);
  }

  public onOpenGallery(selectedCategory: PhotoType, isMobileView: boolean): void {
    const dialogContainerParams = isMobileView ? { width: '100%', minHeight: '100%' } : { width: '80%' };
    const categories = LAYOUT.flatMap(({ categories: [group] }) => DRIVER_PHOTO_GROUP_BY_CATEGORY.get(group)).filter(
      (category) => this.photosForm.get(category).valid,
    );
    const photos = this.photosForm.getRawValue() as Record<string, { url: string }>;
    const photos$ = of(
      Object.keys(photos).reduce((acc, category) => {
        const url = photos?.[category]?.url ?? '';
        return url ? [...acc, { category, data: { url } }] : acc;
      }, []),
    );

    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_IMG_CLICK, selectedCategory);

    this.dialog.open(PhotoGalleryComponent, {
      ...dialogContainerParams,
      disableClose: false,
      restoreFocus: false,
      maxWidth: '768px',
      panelClass: 'mat-dialog-no-padding',
      data: {
        label: 'Common.PhotoTypeFull.',
        categories,
        selectedPhotoData: {
          category: selectedCategory,
          descriptionPath: 'Common.PhotoTypeFull.',
        },
        photos$,
      },
    });
  }

  public handleFileUploaded(selectedCategory: PhotoType): void {
    this.reportAnalytics(FleetAnalyticsEventType.DRIVER_PHOTO_CONTROL_IMG_UPLOADED, selectedCategory);
  }

  private initForm({ picture_types, images, status }: DriverPhotoControlTicketDto): void {
    picture_types.forEach((type) => {
      const url = images?.[type]?.url ?? '';

      this.photosForm.addControl(
        type,
        new FormGroup({
          url: new FormControl(url, Validators.required),
        }),
      );
    });

    this.handleFormDisabling(status);
  }

  private initShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        hideTitleOnMobile: true,
        customTitle: 'DriverPhotoControl.Title',
        customTitleData: this.fullName(),
      },
    });
  }

  private handleFormDisabling(status: TicketStatus): void {
    if (status === TicketStatus.DRAFT || status === TicketStatus.CLARIFICATION) return;

    this.photosForm.disable();
  }

  private reportAnalytics(event: FleetAnalyticsEventType, category?: PhotoType): void {
    this.analytics.reportEvent(event, {
      ticket_id: this.ticket().id,
      ticket_status: this.ticket().status,
      page: 'Driver photo control page',
      ...(category && { img_type: category }),
    });
  }
}
