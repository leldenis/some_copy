import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import {
  ChangePaymentProviderDto,
  FleetDataDto,
  FleetHistoryChangeItemDto,
  FleetHistoryProfileChangeProps,
  FleetHistoryType,
  FleetMerchant,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getFleetData } from '@ui/core/store/account/account.selectors';
import { HistoryDetailsB2bSplitDistributionComponent } from '@ui/modules/fleet-profile/features/fleet-history/components/history-details-b2b-split-distribution/history-details-b2b-split-distribution.component';
import { RegionByIdPipe } from '@ui/modules/fleet-profile/features/fleet-history/pipes/region-by-id.pipe';
import { UIService } from '@ui/shared';
import { IndividualEntrepreneurChangedDetailsDesktopComponent } from '@ui/shared/components/individual-entrepreneur-changed-details-desktop/individual-entrepreneur-changed-details-desktop.component';
import { IndividualEntrepreneurChangedDetailsMobileComponent } from '@ui/shared/components/individual-entrepreneur-changed-details-mobile/individual-entrepreneur-changed-details-mobile.component';
import { IndividualEntrepreneurUpdatedDetailsComponent } from '@ui/shared/components/individual-entrepreneur-updated-details/individual-entrepreneur-updated-details.component';
import { MoneyPipe } from '@ui/shared/pipes/money';
import { Observable } from 'rxjs';

import { Currency } from '@uklon/types';

import { FLEET_HISTORY_PROPS_MAP } from '../../consts/history-properties.const';

interface SelectIndividualEntrepreneurDetailsDto {
  name: string;
  payment_providers: ChangePaymentProviderDto[];
}

interface ChangeIndividualEntrepreneurDetailsDto {
  update_type: 'Changed' | 'Added' | 'Deleted' | 'Recovered';
  old_name?: string;
  new_name?: string;
  name?: string;
  old_payment_providers?: ChangePaymentProviderDto[];
  new_payment_providers?: ChangePaymentProviderDto[];
}

@Component({
  selector: 'upf-fleet-history-details',
  standalone: true,
  templateUrl: './fleet-history-details.component.html',
  styleUrls: ['./fleet-history-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    IndividualEntrepreneurChangedDetailsMobileComponent,
    IndividualEntrepreneurChangedDetailsDesktopComponent,
    AsyncPipe,
    NgTemplateOutlet,
    IndividualEntrepreneurUpdatedDetailsComponent,
    MatDivider,
    RegionByIdPipe,
    MoneyPipe,
    HistoryDetailsB2bSplitDistributionComponent,
  ],
})
export class FleetHistoryDetailsComponent implements OnInit {
  public readonly info = input.required<FleetHistoryChangeItemDto>();

  public readonly reportHistoryDetailsOpened = output<FleetHistoryChangeItemDto>();

  public readonly changeType = FleetHistoryType;
  public readonly profileChangeProps: FleetHistoryProfileChangeProps[] = Object.keys(
    FLEET_HISTORY_PROPS_MAP,
  ) as FleetHistoryProfileChangeProps[];
  public readonly profileHistoryPropsMap = FLEET_HISTORY_PROPS_MAP;
  public readonly defaultCurrency = Currency.UAH;

  private readonly allPaymentProviders = Object.values(FleetMerchant) as FleetMerchant[];

  private readonly uiService = inject(UIService);
  private readonly store = inject(Store);

  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();
  public readonly fleetData = toSignal<FleetDataDto>(this.store.select(getFleetData));

  public ngOnInit(): void {
    this.reportHistoryDetailsOpened.emit(this.info());
  }

  public parseIndividualEntrepreneurSelectedDetails(details?: Record<string, unknown>): {
    name: string;
    paymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>>;
  } {
    const source = details as unknown as SelectIndividualEntrepreneurDetailsDto;

    if (source) {
      const paymentProviders: Partial<Record<FleetMerchant, ChangePaymentProviderDto>> = {};
      this.allPaymentProviders.forEach((item) => {
        paymentProviders[item] = source.payment_providers?.find(({ type }) => type === item);
      });

      return {
        name: source.name,
        paymentProviders,
      };
    }

    return null;
  }

  public parseIndividualEntrepreneurUpdatedDetails(details?: Record<string, unknown>): {
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
}
