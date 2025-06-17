import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { BodyType, TicketStatus } from '@constant';
import {
  AnalyticsCreateVehicle,
  AnalyticsUserRole,
  FleetAnalyticsEventType,
  VehicleTicketConfigDto,
  VehicleTicketCreationDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { IsCargoRequiredPipe } from '@ui/modules/vehicles/features/vehicle-creation/pipes/is-cargo-required/is-cargo-required.pipe';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import {
  getFleetVehicleShowCargo,
  getVehicleTicketId,
  vehiclesActions,
  VehiclesEffects,
} from '@ui/modules/vehicles/store';
import { removeSpaces } from '@ui/modules/vehicles/utils/map-vehicle-payload';
import { UIService } from '@ui/shared';
import { FooterComponent } from '@ui/shared/components/footer/footer.component';
import {
  CreationFormChange,
  VehicleCreationInfoComponent,
} from '@ui/shared/modules/vehicle-shared/vehicle-creation-info/vehicle-creation-info.component';
import { VehicleCreationPhotosComponent } from '@ui/shared/modules/vehicle-shared/vehicle-creation-photos/vehicle-creation-photos.component';
import { tap } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { uuidv4 } from '@uklon/angular-core';

@Component({
  selector: 'upf-vehicle-creation-container',
  standalone: true,
  imports: [
    CommonModule,
    FooterComponent,
    MatButton,
    TranslateModule,
    IsCargoRequiredPipe,
    VehicleCreationInfoComponent,
    VehicleCreationPhotosComponent,
  ],
  templateUrl: './vehicle-creation-container.component.html',
  styleUrl: './vehicle-creation-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCreationContainerComponent implements OnInit, OnDestroy {
  @ViewChild('creationInfo') public readonly creationInfo: VehicleCreationInfoComponent;

  public ticketId: string;
  public vehicleId: string;

  public readonly analyticsEvent: typeof FleetAnalyticsEventType = FleetAnalyticsEventType;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly location = inject(Location);
  private readonly vehiclesEffects = inject(VehiclesEffects);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ticketsService = inject(TicketsService);
  private readonly uiService = inject(UIService);

  public readonly ticketConfig = toSignal<VehicleTicketConfigDto>(this.route.data.pipe(map(({ data }) => data)));
  public readonly hasWarning = signal<boolean>(false);
  public readonly insuranceConsentGiven = signal<boolean>(false);
  public readonly selectedBodyType = signal<BodyType>(null);
  public readonly licensePlateConfirmed = signal<boolean>(false);

  public readonly selectedFleet$ = this.store.select(getSelectedFleet).pipe(filter(Boolean));
  public readonly showCargo$ = this.store.select(getFleetVehicleShowCargo);
  public readonly isMobileView$ = this.uiService.breakpointMatch();
  public readonly ticketId$ = this.store.select(getVehicleTicketId).pipe(
    tap((ticketId) => {
      this.ticketId = ticketId;
    }),
  );

  private ticket: Partial<VehicleTicketCreationDto>;
  private readonly userRole: string = this.storage.get(userRoleKey);

  public ngOnInit(): void {
    this.setShellConfig();
    this.vehiclesEffects.setVehicleCreationTicketSentStatusSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.navigateBack());

    this.reportEvent(FleetAnalyticsEventType.VEHICLES_ADDING_SCREEN);
  }

  public ngOnDestroy(): void {
    this.uiService.resetConfig();
    this.store.dispatch(vehiclesActions.clearFleetVehicleCreationTicketPhotos());
  }

  public navigateBack(): void {
    this.reportEvent(this.analyticsEvent.VEHICLES_ADDING_SCREEN_BACK);
    this.router.navigated ? this.location.back() : this.router.navigate(['../'], { relativeTo: this.route });
  }

  public onConfirmLicensePlate(): void {
    this.licensePlateConfirmed.set(true);
    this.creationInfo.formGroup.controls.licensePlate.disable();
  }

  public handlerCreationFormChange({ form, isValid }: CreationFormChange): void {
    if (!isValid) {
      return;
    }

    this.selectedBodyType.set(form.body_type);

    if (this.ticketId) {
      this.store.dispatch(
        vehiclesActions.updateFleetVehiclesCreationTicket({
          ticketId: this.ticketId,
          form: {
            ...(form.license_plate && { license_plate: form.license_plate }),
            ...(!form.body_type && form.options?.length && { options: [...form.options] }),
            ...(form.body_type === BodyType.CARGO &&
              form.load_capacity && { body_type: form.body_type, load_capacity: form.load_capacity }),
          },
          skipSendStatus: true,
        }),
      );
    }
  }

  public handlerCreateTicket(fleetId: string): void {
    const body: Partial<VehicleTicketCreationDto> = {
      tiket_id: uuidv4(),
      ...(this.creationInfo.formGroup.controls.options.value?.length > 0 && {
        options: this.creationInfo.formGroup.controls.options.value,
      }),
      license_plate: removeSpaces(this.creationInfo.formGroup.controls.licensePlate?.value),
      ...(this.creationInfo.formGroup.controls.bodyType.value && {
        body_type: this.creationInfo.formGroup.controls.bodyType.value,
      }),
    };

    this.vehicleId = uuidv4();
    this.ticketId = body.tiket_id;
    this.ticket = body;
    this.store.dispatch(vehiclesActions.postFleetVehicleTicketById({ fleetId, vehicleId: this.vehicleId, body }));
  }

  public onSendClick(): void {
    this.hasWarning.set(true);
    this.store.dispatch(vehiclesActions.setVehicleCreationTicketSentStatus({ tiket_id: this.ticketId }));
    this.analytics.reportEvent<AnalyticsCreateVehicle>(FleetAnalyticsEventType.VEHICLES_ADDING_SCREEN_SEND, {
      user_access: this.userRole,
      ticket_id: this.ticketId,
      ticket_status: TicketStatus.DRAFT,
      vehicleFields: this.ticket as unknown as Record<string, unknown>,
    });

    this.ticketsService
      .getFleetVehiclesCreationTicket(this.ticketId)
      .pipe(take(1))
      .subscribe((data) => {
        this.analytics.reportEvent<AnalyticsCreateVehicle>(
          FleetAnalyticsEventType.VEHICLES_ADDING_SCREEN_TICKET_CREATED,
          {
            user_access: this.userRole,
            ticket_id: this.ticketId,
            ticket_status: data.status,
            vehicleFields: this.ticket as unknown as Record<string, unknown>,
          },
        );
      });
  }

  public changeInsuranceConsentGiven(value: boolean): void {
    this.insuranceConsentGiven.set(value);
  }

  private reportEvent(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent<AnalyticsUserRole>(eventType, {
      user_access: this.userRole,
      ...(this.ticketId && { ticket_id: this.ticketId }),
    });
  }

  private setShellConfig(): void {
    this.uiService.setConfig({
      header: {
        title: false,
        backNavigationButton: true,
        customTitle: 'Header.Title.VehicleCreate',
        hideTitleOnMobile: true,
      },
    });
  }
}
