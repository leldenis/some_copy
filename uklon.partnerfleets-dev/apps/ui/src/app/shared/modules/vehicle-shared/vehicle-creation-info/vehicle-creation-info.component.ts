import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  input,
  computed,
  output,
  effect,
  signal,
  Injector,
  AfterViewInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { AdvancedOptions, BodyType, LoadCapacity } from '@constant';
import {
  AddVehicleTicketDto,
  AnalyticsAddingVehicle,
  FleetAnalyticsEventType,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
} from '@data-access';
import { ofType } from '@ngrx/effects';
import { ActionsSubject, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { ReferencesService } from '@ui/core/services/references.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { getBodyTypes } from '@ui/core/store/references/references.selectors';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { vehiclesActions } from '@ui/modules/vehicles/store';
import { removeSpaces } from '@ui/modules/vehicles/utils/map-vehicle-payload';
import { CustomValidators } from '@ui/shared';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { VehicleBodyTypeSwitcherComponent } from '@ui/shared/modules/vehicle-shared/components/vehicle-body-type-switcher/vehicle-body-type-switcher.component';
import { TranslateLoadCapacityPipe } from '@ui/shared/modules/vehicle-shared/pipes/load-capacity/translate-load-capacity.pipe';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';

const DEBOUNCE_TIME = 300;

export interface TicketForm {
  licensePlate: string;
  bodyType: BodyType;
  options: AdvancedOptions[];
  loadCapacity?: LoadCapacity;
}

export interface CreationFormChange {
  isValid: boolean;
  form: VehicleTicketUpdateDto;
}

@Component({
  selector: 'upf-vehicle-creation-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    InfoPanelComponent,
    MatFormField,
    AsyncPipe,
    RouterLink,
    MatIcon,
    MatOption,
    MatLabel,
    VehicleBodyTypeSwitcherComponent,
    TranslateLoadCapacityPipe,
    MatSelect,
    MatInput,
  ],
  templateUrl: './vehicle-creation-info.component.html',
  styleUrl: './vehicle-creation-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCreationInfoComponent implements OnInit, AfterViewInit {
  public readonly isCreation = input<boolean>();
  public readonly isEdit = input<boolean>();
  public readonly showCargo = input<boolean>(false);
  public readonly fleetId = input<string>();
  public readonly disabledVehicleBodyType = input<boolean>(false);
  public readonly ticket = input<AddVehicleTicketDto>();

  public readonly creationFormChange = output<CreationFormChange>();

  public readonly vehiclePaths = VehiclePaths;
  public readonly bodyType = BodyType;
  public readonly loadCapacityOptions = [LoadCapacity.SMALL, LoadCapacity.MEDIUM, LoadCapacity.LARGE];

  public readonly selectedBodyType = signal<BodyType>(null);
  public readonly lastPassengerBodyType = signal<BodyType>(null);
  public readonly ticketDuplicate = signal<VehicleTicketDto | null>(null);

  public readonly isSelectedBodyTypeCargo = computed(() => this.selectedBodyType() === BodyType.CARGO);
  public readonly shouldDisabledBodyType = computed(() => {
    if (!this.isCreation() && !this.isEdit()) {
      this.formGroup.disable();
      return true;
    }

    return this.disabledVehicleBodyType();
  });

  private licensePlate: string;

  public formGroup = new FormGroup({
    licensePlate: new FormControl<string>(null, [Validators.required, CustomValidators.licensePlate()]),
    bodyType: new FormControl<BodyType>(null),
    options: new FormControl<AdvancedOptions[]>(null),
    loadCapacity: new FormControl<LoadCapacity>(null),
  });

  private readonly injector = inject(Injector);
  private readonly store = inject(Store);
  private readonly referenceService = inject(ReferencesService);
  private readonly actionsSubject = inject(ActionsSubject);
  private readonly analytics = inject(AnalyticsService);
  private readonly storage = inject(StorageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ticketsService = inject(TicketsService);

  public bodyTypesList$ = this.store.select(getBodyTypes);
  public advancedOptionsList$ = this.store.select(getSelectedFleet).pipe(
    filter(Boolean),
    switchMap(({ region_id }) => this.referenceService.getOptionsByRegion(region_id ?? '')),
    map(({ items }) => items),
  );

  public ngOnInit(): void {
    this.handleFormChanges();
    this.listenEventClearVehicleCreate();
    if (this.isCreation() || this.isEdit()) {
      this.checkExistingTickets();
    }
  }

  public ngAfterViewInit(): void {
    if (this.ticket()) {
      this.changeBodyType(this.ticket()?.body_type);
    }
  }

  public changeBodyType(bodyType: BodyType): void {
    this.selectedBodyType.set(bodyType === BodyType.CARGO ? BodyType.CARGO : null);
    this.updateCargoControls(this.selectedBodyType());
  }

  public updateCargoControls(value: BodyType): void {
    const bodyTypeControl = this.formGroup.get('bodyType');
    const loadCapacityControl = this.formGroup.get('loadCapacity');

    if (value === BodyType.CARGO) {
      this.lastPassengerBodyType.set(bodyTypeControl.value);
      bodyTypeControl.patchValue(value, { emitEvent: true });
      bodyTypeControl.disable({ emitEvent: true });
      loadCapacityControl.addValidators(Validators.required);
      loadCapacityControl.updateValueAndValidity();
    } else {
      bodyTypeControl.patchValue(this.lastPassengerBodyType(), { emitEvent: false });
      bodyTypeControl.enable({ emitEvent: true });
      loadCapacityControl.removeValidators(Validators.required);
      loadCapacityControl.updateValueAndValidity();
    }
  }

  public reportAnalyticsEvent(field: string, focused = true): void {
    this.analytics.reportEvent<AnalyticsAddingVehicle>(
      focused
        ? FleetAnalyticsEventType.VEHICLES_ADDING_FIELD_FOCUSED
        : FleetAnalyticsEventType.VEHICLES_ADDING_FIELD_UNFOCUSED,
      {
        user_access: this.storage.get(userRoleKey),
        field,
        ...(this.ticket() && { ticket_id: this.ticket().id }),
      },
    );
  }

  private handleFormChanges(): void {
    effect(
      () => {
        const vehicleTicket = this.ticket();
        if (!vehicleTicket) return;

        this.patchForm(vehicleTicket);
      },
      { allowSignalWrites: true, injector: this.injector },
    );

    this.formGroup.valueChanges
      .pipe(
        startWith(this.isEdit() ? this.formGroup.getRawValue() : null),
        map(() => this.formGroup.getRawValue()),
        filter(Boolean),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.creationFormChange.emit(this.formChangeEventMapper(value as TicketForm));
      });
  }

  private patchForm(ticket: AddVehicleTicketDto): void {
    const payload = {
      licensePlate: removeSpaces(ticket.license_plate),
      bodyType: ticket.body_type,
      options: ticket.options,
    };

    this.licensePlate = removeSpaces(ticket.license_plate);
    this.formGroup.patchValue(
      ticket.body_type === this.bodyType.CARGO ? { ...payload, loadCapacity: ticket.load_capacity } : payload,
    );
  }

  private checkExistingTickets(): void {
    const licensePlateControl = this.formGroup.get('licensePlate');

    licensePlateControl.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        distinctUntilChanged(),
        switchMap((licensePlate) =>
          licensePlate
            ? this.ticketsService.getVehicleAdditionTicketByLicensePlate(this.fleetId(), licensePlate)
            : of({ items: [] }),
        ),
        map(({ items }) =>
          this.isEdit() ? items.filter(({ license_plate }) => license_plate !== this.licensePlate) : items,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((tickets) => {
        if (tickets.length > 0) {
          licensePlateControl.setErrors({ ticketExists: true });
          licensePlateControl.markAsTouched();
          this.ticketDuplicate.set(tickets[0]);
        } else {
          licensePlateControl.setErrors({ ticketExists: null });
          licensePlateControl.updateValueAndValidity({ emitEvent: false });
          this.ticketDuplicate.set(null);
        }

        this.creationFormChange.emit(this.formChangeEventMapper(this.formGroup.getRawValue() as TicketForm));
      });
  }

  private listenEventClearVehicleCreate(): void {
    this.actionsSubject
      .pipe(ofType(vehiclesActions.clearVehicleCreatePage), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.selectedBodyType.set(null);
        this.formGroup.reset();
      });
  }

  private formChangeEventMapper(formValue: TicketForm): { isValid: boolean; form: VehicleTicketUpdateDto } {
    const { licensePlate, bodyType, loadCapacity, options } = formValue;
    let payload: VehicleTicketUpdateDto = {
      license_plate: removeSpaces(licensePlate),
      body_type: bodyType,
    };

    payload = this.isSelectedBodyTypeCargo()
      ? { ...payload, load_capacity: loadCapacity, body_type: BodyType.CARGO }
      : { ...payload, options };

    return { isValid: this.formGroup.valid, form: payload };
  }
}
