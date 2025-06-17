import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DriverFinanceAllowing, Restriction, RestrictionReason } from '@constant';
import {
  DriverFinanceProfileDto,
  DriverRestrictionDto,
  DriverRestrictionListDto,
  UpdateDriverFinanceProfileDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core/services/datasource/driver.service';
import { ToastService } from '@ui/core/services/toast.service';
import { DriversState } from '@ui/modules/drivers/store';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';
import { StatusBadgeComponent } from '@ui/shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { forkJoin, from, mergeWith, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, finalize, map, tap } from 'rxjs/operators';

import {
  DriverRestrictionViewModelFactoryService,
  RestrictionForm,
  RestrictionViewModel,
} from './driver-restriction-view-model-factory.service';

interface FinanceProfileForm {
  paymentToCard: FormControl<boolean>;
  walletToCard: FormControl<boolean>;
}

interface DriverRestrictionForm {
  restrictions: FormArray<FormGroup<RestrictionForm>>;
  financeProfile: FormGroup<FinanceProfileForm>;
}

@Component({
  selector: 'upf-driver-restriction',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    AsyncPipe,
    MatSlideToggle,
    StatusBadgeComponent,
    NgxTippyModule,
    MatButton,
  ],
  templateUrl: './driver-restriction.component.html',
  styleUrls: ['./driver-restriction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DriverRestrictionViewModelFactoryService],
})
export class DriverRestrictionComponent implements OnChanges, OnDestroy {
  @Input() public fleetId: string;
  @Input() public driverId: string;
  @Input() public isDriverBlocked = false;

  public readonly driverFinanceAllowing = DriverFinanceAllowing;

  public financialSettingsDisabled: boolean;
  public orderRestrictions$: Observable<RestrictionViewModel[]>;
  public financeProfile$: Observable<DriverFinanceProfileDto>;

  public formGroup: FormGroup<DriverRestrictionForm> = new FormGroup({
    restrictions: new FormArray<FormGroup<RestrictionForm>>([]),
    financeProfile: new FormGroup<FinanceProfileForm>({
      paymentToCard: new FormControl<boolean>({
        value: false,
        disabled: this.isDriverBlocked,
      }),
      walletToCard: new FormControl<boolean>({
        value: false,
        disabled: this.isDriverBlocked,
      }),
    }),
  });

  private driverRestrictionList: DriverRestrictionListDto;
  private driverFinanceProfile: DriverFinanceProfileDto;
  private readonly driverRestrictionListChange$ = new Subject<DriverRestrictionListDto>();
  private readonly driverFinanceProfileChange$ = new Subject<DriverFinanceProfileDto>();

  constructor(
    private readonly viewModelFactory: DriverRestrictionViewModelFactoryService,
    private readonly driversService: DriverService,
    private readonly toastService: ToastService,
    private readonly store: Store<DriversState>,
    private readonly destroyRef: DestroyRef,
  ) {}

  public get financeProfile(): FormGroup {
    return this.formGroup.get('financeProfile') as FormGroup;
  }

  public get orderRestrictions(): FormArray<FormGroup<RestrictionForm>> {
    return this.formGroup.get('restrictions') as FormArray<FormGroup<RestrictionForm>>;
  }

  public ngOnChanges({ fleetId, driverId }: SimpleChanges): void {
    const hasChanges = fleetId?.currentValue && driverId?.currentValue;
    if (hasChanges) {
      this.createRestrictionSettingsStreams(fleetId.currentValue, driverId.currentValue);
    }
  }

  public onSaveClick(): void {
    forkJoin([this.updateDriverRestrictions(), this.updateFinanceProfile()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.store.dispatch(
          driversActions.getFleetDriverRestrictions({ fleetId: this.fleetId, driverId: this.driverId }),
        );
      });
  }

  public ngOnDestroy(): void {
    this.driverFinanceProfileChange$.complete();
    this.driverRestrictionListChange$.complete();
  }

  private createRestrictionSettingsStreams(fleetId: string, driverId: string): void {
    this.setRestrictionsSettingsStream(fleetId, driverId);
    this.setFinanceProfileStream(fleetId, driverId);
  }

  private setRestrictionsSettingsStream(fleetId: string, driverId: string): void {
    this.orderRestrictions$ = this.driversService.getRestrictionsSettings(fleetId, driverId).pipe(
      tap((list) => {
        this.driverRestrictionList = list;
      }),
      mergeWith(this.driverRestrictionListChange$),
      map((restrictions: DriverRestrictionListDto) => this.createRestrictionViewModels(restrictions)),
      tap(() => {
        if (this.isDriverBlocked) {
          this.orderRestrictions.disable();
          this.financeProfile.disable();
        }
      }),
    );
  }

  private createRestrictionViewModels(list: DriverRestrictionListDto): RestrictionViewModel[] {
    const restrictions = this.createRestrictions(list?.items || []);
    return this.viewModelFactory.createAll(restrictions, this.orderRestrictions);
  }

  private createRestrictions(restrictions: DriverRestrictionDto[]): Partial<DriverRestrictionDto>[] {
    const restrictionsMap = new Map<Restriction, DriverRestrictionDto>();
    restrictions.forEach((restriction) => restrictionsMap.set(restriction.type, restriction));

    return this.viewModelFactory.restrictionTypes.map((type) => restrictionsMap.get(type) || { type });
  }

  private setFinanceProfileStream(fleetId: string, driverId: string): void {
    this.financeProfile$ = this.driversService.getFinanceProfile(fleetId, driverId).pipe(
      tap((financeProfile) => {
        this.driverFinanceProfile = financeProfile;
      }),
      mergeWith(this.driverFinanceProfileChange$),
      tap((financeProfileDto: DriverFinanceProfileDto) => this.setFinanceProfileFormValue(financeProfileDto)),
    );
  }

  private setFinanceProfileFormValue(financeProfileDto: DriverFinanceProfileDto): void {
    this.financeProfile.patchValue({
      paymentToCard: this.isAllowedPaymentToCard(financeProfileDto),
      walletToCard: this.isAllowedWalletToCard(financeProfileDto),
    });
  }

  private updateDriverRestrictions(): Observable<Restriction | void> {
    if (this.orderRestrictions.pristine) return of(null);

    this.orderRestrictions.disable();
    const restrictions = this.orderRestrictions.controls
      .filter((control) => control.get('hasRestriction').dirty)
      .map(({ value }) => value);

    return from([...restrictions]).pipe(
      concatMap(({ hasRestriction, type }) =>
        (hasRestriction
          ? this.driversService.delRestriction(this.fleetId, this.driverId, { type })
          : this.driversService.setRestriction(this.fleetId, this.driverId, { type })
        ).pipe(map(() => type)),
      ),
      tap((type) => this.handleRestrictionUpdated(type)),
      catchError(() => {
        this.displayErrorMessage();
        return of(null);
      }),
      finalize(() => {
        this.orderRestrictions.enable();
        this.formGroup.markAsPristine();
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private updateFinanceProfile(): Observable<DriverFinanceProfileDto | void> {
    if (this.financeProfile.pristine) return of(null);

    this.financeProfile.disable();
    const { paymentToCard, walletToCard } = this.financeProfile.getRawValue();
    const payload: UpdateDriverFinanceProfileDto = {
      order_payment_to_card_allowed: paymentToCard ?? false,
      wallet_to_card_transfer_allowed: walletToCard ?? false,
    };

    return this.driversService.setFinanceProfile(this.fleetId, this.driverId, payload).pipe(
      tap(() => this.handleFinanceProfileUpdated()),
      catchError(() => {
        this.displayErrorMessage();
        return of(null);
      }),
      finalize(() => {
        this.financeProfile.enable();
        this.formGroup.markAsPristine();
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  private handleRestrictionUpdated(type: Restriction): void {
    const restriction = this.driverRestrictionList?.items?.find((value) => value.type === type);

    if (restriction) {
      restriction.restricted_by = RestrictionReason.FLEET;
    } else {
      this.driverRestrictionList.items.push({ type, restricted_by: RestrictionReason.FLEET } as DriverRestrictionDto);
    }

    this.driverRestrictionListChange$.next(this.driverRestrictionList);
  }

  private displayErrorMessage(): void {
    this.toastService.error('Common.Error.TemporarilyUnavailable');
  }

  private handleFinanceProfileUpdated(): void {
    const { paymentToCard, walletToCard } = this.financeProfile.getRawValue();
    this.driverFinanceProfile.order_payment_to_card.is_allowing = paymentToCard;
    this.driverFinanceProfile.order_payment_to_card.configured_by = DriverFinanceAllowing.FLEET_OWNER;
    this.driverFinanceProfile.wallet_to_card_transfer.is_allowing = walletToCard;
    this.driverFinanceProfile.wallet_to_card_transfer.configured_by = DriverFinanceAllowing.FLEET_OWNER;
    this.driverFinanceProfileChange$.next({ ...this.driverFinanceProfile });
  }

  private isAllowedPaymentToCard(financeProfileDto: DriverFinanceProfileDto): boolean {
    return financeProfileDto?.order_payment_to_card?.is_allowing;
  }

  private isAllowedWalletToCard(financeProfileDto: DriverFinanceProfileDto): boolean {
    return financeProfileDto?.wallet_to_card_transfer?.is_allowing;
  }
}
