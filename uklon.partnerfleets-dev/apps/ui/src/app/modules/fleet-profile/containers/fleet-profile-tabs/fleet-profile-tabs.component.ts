import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountDto, FleetAnalyticsEventType, FleetDetailsDto, FleetFiscalizationSettingsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { FleetContactsComponent } from '@ui/modules/fleet-profile/containers/fleet-contacts/fleet-contacts.component';
import { FleetHistoryContainerComponent } from '@ui/modules/fleet-profile/features/fleet-history/containers/fleet-history-container/fleet-history-container.component';
import { FleetRROContainerComponent } from '@ui/modules/fleet-profile/features/fleet-rro/containers/fleet-rro-container/fleet-rro-container.component';
import { NamedFragmentsDirective, NAMED_FRAGMENTS, MAT_TAB_IMPORTS, IndicatorComponent } from '@ui/shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

export enum FleetProfileTabs {
  HISTORY = 'history',
  CONTACTS = 'contacts',
  RRO = 'rro',
}

const ANALYTICS_EVENT_TYPE = [
  FleetAnalyticsEventType.ORDER_REPORT_SCREEN,
  FleetAnalyticsEventType.ORDER_TRIPS_SCREEN,
  FleetAnalyticsEventType.VEHICLES_REPORTS_SCREEN,
] as const;

@Component({
  selector: 'upf-fleet-profile-tabs',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    FleetHistoryContainerComponent,
    TranslateModule,
    AsyncPipe,
    FleetContactsComponent,
    NgxTippyModule,
    IndicatorComponent,
    FleetRROContainerComponent,
  ],
  templateUrl: './fleet-profile-tabs.component.html',
  styleUrls: ['./fleet-profile-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: [FleetProfileTabs.HISTORY, FleetProfileTabs.CONTACTS, FleetProfileTabs.RRO],
    },
  ],
})
export class FleetProfileTabsComponent extends NamedFragmentsDirective {
  @Input({ required: true }) public fleet: FleetDetailsDto;
  @Input({ required: true }) public account: AccountDto;
  @Input({ required: true }) public b2bActivated: boolean;
  @Input({ required: true }) public settings: FleetFiscalizationSettingsDto;
  @Input({ required: true }) public rroAvailable: boolean;
  @Input({ required: true }) public showIndicator: boolean;

  constructor(
    private readonly analytics: AnalyticsService,
    private readonly destroyRef: DestroyRef,
  ) {
    super();
    this.handleTabNavigation();
  }

  private reportTabChange(index: number): void {
    const eventType = ANALYTICS_EVENT_TYPE[index];
    if (!eventType) return;

    this.analytics.reportEvent(eventType);
  }

  private handleTabNavigation(): void {
    this.navigatedToFragment$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((index) => this.reportTabChange(index));
  }
}
