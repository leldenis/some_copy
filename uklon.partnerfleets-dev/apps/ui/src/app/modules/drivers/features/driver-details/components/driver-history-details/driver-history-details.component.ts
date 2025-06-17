import { AsyncPipe, KeyValuePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { BlockedListStatusReason } from '@constant';
import {
  AvailabilityRulesActivationDto,
  ChangePaymentProviderDto,
  DriverHistoryChange,
  DriverHistoryChangeItemDetailsDto,
  DriverHistoryChangeItemDto,
  DriverHistoryProfileChangeProps,
  DriverPaymentInfoDto,
  FleetDataDto,
  FleetMerchant,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getFleetData } from '@ui/core/store/account/account.selectors';
import { DRIVER_HISTORY_PROPS_MAP } from '@ui/modules/drivers/consts/history-properties.const';
import { NormalizeStringPipe, UIService } from '@ui/shared';
import { IndividualEntrepreneurChangedDetailsDesktopComponent } from '@ui/shared/components/individual-entrepreneur-changed-details-desktop/individual-entrepreneur-changed-details-desktop.component';
import { IndividualEntrepreneurChangedDetailsMobileComponent } from '@ui/shared/components/individual-entrepreneur-changed-details-mobile/individual-entrepreneur-changed-details-mobile.component';
import { IndividualEntrepreneurUpdatedDetailsComponent } from '@ui/shared/components/individual-entrepreneur-updated-details/individual-entrepreneur-updated-details.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Observable } from 'rxjs';

import { Currency } from '@uklon/types';

interface ChangeIndividualEntrepreneurDetailsDto {
  update_type: 'Changed' | 'Added' | 'Deleted' | 'Recovered';
  old_name?: string;
  new_name?: string;
  name?: string;
  old_payment_providers?: ChangePaymentProviderDto[];
  new_payment_providers?: ChangePaymentProviderDto[];
}

@Component({
  selector: 'upf-driver-history-details',
  standalone: true,
  imports: [
    NgClass,
    AsyncPipe,
    NgTemplateOutlet,
    KeyValuePipe,
    TranslateModule,
    MatDividerModule,
    MatIconModule,
    NormalizeStringPipe,
    IndividualEntrepreneurChangedDetailsDesktopComponent,
    IndividualEntrepreneurChangedDetailsMobileComponent,
    IndividualEntrepreneurUpdatedDetailsComponent,
    MoneyPipe,
    Seconds2DatePipe,
  ],
  templateUrl: './driver-history-details.component.html',
  styleUrls: ['./driver-history-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverHistoryDetailsComponent implements OnInit {
  @Input() public info: DriverHistoryChangeItemDto;

  public isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  public readonly changeType = DriverHistoryChange;
  public readonly statusReason = BlockedListStatusReason;
  public readonly profileChangeProps: DriverHistoryProfileChangeProps[] = Object.keys(
    DRIVER_HISTORY_PROPS_MAP,
  ) as DriverHistoryProfileChangeProps[];
  public readonly profileHistoryPropsMap = DRIVER_HISTORY_PROPS_MAP;
  public readonly financeProfileIntl = {
    new_order_payment_to_card: 'Drivers.Drivers.Restriction.FinanceGroup.OrderPaymentToCard.Title',
    new_wallet_to_card_transfer: 'Drivers.Drivers.Restriction.FinanceGroup.WalletToCardTransfer.Title',
  };
  public paymentDetailsMap: Record<keyof DriverPaymentInfoDto, string>;
  public productEditableByDriverMap: Record<string, boolean> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public productActivationRules: any = {};
  public readonly defaultCurrency = Currency.UAH;
  public readonly fleetData = toSignal<FleetDataDto>(this.store.select(getFleetData));

  private readonly allPaymentProviders = Object.values(FleetMerchant) as FleetMerchant[];

  constructor(
    private readonly uiService: UIService,
    private readonly store: Store<AccountState>,
  ) {}

  public ngOnInit(): void {
    this.initPaymentDetails();
    this.initProductsEditableByDriver();
    this.initActivationRules();
  }

  public parseIndividualEntrepreneurUpdatedDetails(details?: DriverHistoryChangeItemDetailsDto): {
    updateType: 'Changed' | 'Added' | 'Deleted' | 'Recovered';
    oldName: string;
    newName: string;
    oldPaymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>>;
    newPaymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>>;
  } {
    const source = details as unknown as ChangeIndividualEntrepreneurDetailsDto;

    if (source) {
      const oldPaymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>> = {};
      const newPaymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>> = {};

      if (source.old_payment_providers?.length > 0 || source.new_payment_providers?.length > 0) {
        this.allPaymentProviders.forEach((item) => {
          oldPaymentProviders[item] = source.old_payment_providers?.find(({ type }) => type === item);
          newPaymentProviders[item] = source.new_payment_providers?.find(({ type }) => type === item);
        });
      }

      return {
        updateType: source.update_type,
        oldName: source.old_name || source.name,
        newName: source.new_name || source.name,
        oldPaymentProviders,
        newPaymentProviders,
      };
    }

    return null;
  }

  /* Decide with which obj to start iteration (if no prop in old/new exsits means it was deleted)
  e.g. { new : {vat_number: "1111111"}, { old: {} }  } - then begin with new and show empty string for old vat_number
  and vice versa */
  private initPaymentDetails(): void {
    const { new_payment_details, old_payment_details } = this.info.details;
    if (this.info.change_type !== DriverHistoryChange.PROFILE_CHANGED || !new_payment_details || !old_payment_details)
      return;

    const newPropsLength = Object.keys(new_payment_details).length;
    const oldPropsLength = Object.keys(old_payment_details).length;

    this.paymentDetailsMap = this.info.details[
      newPropsLength > oldPropsLength ? 'new_payment_details' : 'old_payment_details'
    ] as Record<keyof DriverPaymentInfoDto, string>;
  }

  private initProductsEditableByDriver(): void {
    if (this.info.change_type !== DriverHistoryChange.PRODUCT_EDIT_BY_DRIVER_CHANGED) return;

    const { became_editable_by_driver, became_uneditable_by_driver } = this.info.details;
    const products = [...new Set([...became_editable_by_driver, ...became_uneditable_by_driver])];

    products.forEach((product) => {
      this.productEditableByDriverMap[product] = became_editable_by_driver.includes(product);
    });
  }

  private initActivationRules(): void {
    if (this.info.change_type !== DriverHistoryChange.PRODUCT_RULES_ACTIVATIONS_CHANGED) return;

    this.productActivationRules = {};
    const { availability_rules_activations, editing_availability_rules_activations } = this.info.details;
    const availabilityNames = availability_rules_activations.map(({ name }) => name);
    const editingNames = editing_availability_rules_activations.map(({ name }) => name);
    const names = [...new Set([...availabilityNames, ...editingNames])];

    names.forEach((ruleName) => {
      const availabilityIndex = availability_rules_activations.findIndex(({ name }) => name === ruleName);
      const editingIndex = editing_availability_rules_activations.findIndex(({ name }) => name === ruleName);

      this.populateActivationRules(
        availability_rules_activations,
        availabilityIndex,
        ruleName,
        'availability_rules_activations',
      );
      this.populateActivationRules(
        editing_availability_rules_activations,
        editingIndex,
        ruleName,
        'editing_availability_rules_activations',
      );
    });
  }

  private populateActivationRules(
    rules: AvailabilityRulesActivationDto[],
    index: number,
    ruleName: string,
    property: 'availability_rules_activations' | 'editing_availability_rules_activations',
  ): void {
    if (index > -1) {
      if (!this.productActivationRules[ruleName]) {
        this.productActivationRules[ruleName] = {};
      }

      this.productActivationRules[ruleName][property] = {
        old: rules[index].old,
        new: rules[index].new,
      };
    }
  }
}
