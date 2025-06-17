import { AsyncPipe, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketStatus } from '@constant';
import {
  AddVehicleTicketDto,
  TicketActivityLogItemDto,
  VehicleTicketConfigDto,
  VehicleTicketUpdateDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getFleetVehicleShowCargo, vehiclesActions, VehiclesEffects } from '@ui/modules/vehicles/store';
import { removeSpaces } from '@ui/modules/vehicles/utils/map-vehicle-payload';
import { StatusBadgeComponent, TicketStatusReasonsComponent, UIService } from '@ui/shared';
import { FooterComponent } from '@ui/shared/components/footer/footer.component';
import { VEHICLE_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { VehicleCreationInfoComponent } from '@ui/shared/modules/vehicle-shared/vehicle-creation-info/vehicle-creation-info.component';
import { VehicleCreationPhotosComponent } from '@ui/shared/modules/vehicle-shared/vehicle-creation-photos/vehicle-creation-photos.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'upf-vehicle-ticket-container',
  standalone: true,
  imports: [
    FooterComponent,
    TranslateModule,
    MatButton,
    TicketStatusReasonsComponent,
    StatusBadgeComponent,
    AsyncPipe,
    VehicleCreationInfoComponent,
    VehicleCreationPhotosComponent,
  ],
  templateUrl: './vehicle-ticket-container.component.html',
  styleUrl: './vehicle-ticket-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTicketContainerComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('statusTpl')
  public statusTpl: TemplateRef<unknown>;

  @ViewChild('creationInfo') public readonly creationInfo: VehicleCreationInfoComponent;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly location = inject(Location);
  private readonly vehiclesEffects = inject(VehiclesEffects);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private readonly uiService = inject(UIService);

  public readonly licensePlateConfirmed = signal<boolean>(false);
  public readonly selectedFleetId = signal<string>('');
  public readonly ticket = toSignal<AddVehicleTicketDto>(
    this.route.data.pipe(
      map(({ data: { ticket, fleetId } }) => {
        this.selectedFleetId.set(fleetId);
        return ticket;
      }),
    ),
  );
  public readonly ticketConfig = toSignal<VehicleTicketConfigDto>(
    this.route.data.pipe(map(({ data: { config } }) => config)),
  );

  public readonly canEdit = computed<boolean>(
    () =>
      this.ticket()?.status &&
      (this.ticket().status === TicketStatus.DRAFT || this.ticket().status === TicketStatus.CLARIFICATION),
  );

  public readonly activeLogs = computed<TicketActivityLogItemDto[]>(
    () =>
      this.ticket()
        ?.activity_log.filter((item: TicketActivityLogItemDto) => item.status === TicketStatus.CLARIFICATION)
        .slice(-1) || [],
  );

  public readonly isMobileView$ = this.uiService.breakpointMatch();
  public readonly showCargo$ = this.store.select(getFleetVehicleShowCargo);

  public readonly ticketStatusColorMap = VEHICLE_TICKET_STATUS_COLOR;
  public readonly ticketStatus = TicketStatus;
  public photosValid: boolean;
  public fromGroupData: { isValid: boolean; form: VehicleTicketUpdateDto };

  public ngAfterViewInit(): void {
    effect(
      () => {
        if (this.ticket() && this.statusTpl) {
          this.setShellConfig(this.ticket().status);
        }

        if (this.ticket() && this.ticket()?.license_plate) {
          this.onConfirmLicensePlate();
        }
      },
      { allowSignalWrites: true, injector: this.injector },
    );
  }

  public ngOnInit(): void {
    this.vehiclesEffects.setVehicleCreationTicketSentStatusSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.navigateBack());
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
    this.store.dispatch(vehiclesActions.clearFleetVehicleCreationTicketPhotos());
  }

  public navigateBack(): void {
    this.router.navigated ? this.location.back() : this.router.navigate(['../'], { relativeTo: this.route });
  }

  public onConfirmLicensePlate(): void {
    this.licensePlateConfirmed.set(true);
    this.creationInfo.formGroup.controls.licensePlate.disable();

    if (this.ticket() && !this.ticket()?.license_plate) {
      this.onSendClick(
        {
          ...this.ticket(),
          license_plate: removeSpaces(this.creationInfo.formGroup.controls.licensePlate.value ?? ''),
        },
        true,
      );
    }
  }

  public creationFormChange(value: { isValid: boolean; form: VehicleTicketUpdateDto }): void {
    this.fromGroupData = value;
  }

  public onPhotoUploaded(photosValid: boolean): void {
    this.photosValid = photosValid;
  }

  public onSendClick(ticket: AddVehicleTicketDto, skipSendStatus = false): void {
    this.store.dispatch(
      vehiclesActions.updateFleetVehiclesCreationTicket({
        ticketId: ticket.id,
        form: { ...ticket, ...this.fromGroupData.form } as VehicleTicketUpdateDto,
        skipSendStatus,
      }),
    );
  }

  private setShellConfig(context: TicketStatus): void {
    this.uiService.setConfig({
      header: {
        title: false,
        branding: false,
        backNavigationButton: true,
        customTitle: 'Header.Title.VehicleCreate',
        hideTitleOnMobile: true,
        template: this.statusTpl,
        templateContext: context,
      },
    });
  }
}
