import { Clipboard } from '@angular/cdk/clipboard';
import { Platform } from '@angular/cdk/platform';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { FleetAnalyticsEventType, FleetMaintainerDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsService } from '@ui/core/services/analytics.service';
import { StorageService, userRoleKey } from '@ui/core/services/storage.service';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

const ANALYTICS_DESCRIPTION = new Map<FleetAnalyticsEventType, string>([
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_OPENED, '“Contact manager” button click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CLOSED, 'Contact manager panel closed'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_COPY_PHONE, 'Contact manager panel copy phone icon click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CONTACT_VIA_PHONE_CLICK, 'Contact manager panel phone icon click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CONTACT_VIA_VIBER_CLICK, 'Contact manager panel Viber icon click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CONTACT_VIA_TELEGRAM_CLICK, 'Contact manager panel Telegram icon click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_COPY_EMAIL, 'Contact manager panel copy email icon click'],
  [FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CONTACT_VIA_EMAIL_CLICK, 'Contact manager panel email icon click'],
]);

@Component({
  selector: 'upf-shell-fleet-maintainer',
  standalone: true,
  imports: [MatIcon, MatMenuTrigger, MatIconButton, MatMenu, NgClass, NgxTippyModule, TranslateModule],
  templateUrl: './shell-fleet-maintainer.component.html',
  styleUrl: './shell-fleet-maintainer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellFleetMaintainerComponent {
  @ViewChild(MatMenuTrigger)
  public trigger: MatMenuTrigger;

  public drawerOpened = input.required<boolean>();
  public maintainer = input.required<FleetMaintainerDto>();
  public absentTill = input.required<string>();

  public readonly copiedValue = signal<string>('');
  public readonly analyticsEvent = FleetAnalyticsEventType;

  public readonly icons = inject(ICONS);
  public readonly platform = inject(Platform);
  public readonly clipboard = inject(Clipboard);
  public readonly storage = inject(StorageService);
  public readonly analytics = inject(AnalyticsService);

  public get isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }

  public onCopy(
    value: string,
    eventType:
      | FleetAnalyticsEventType.FLEET_MANAGER_PANEL_COPY_PHONE
      | FleetAnalyticsEventType.FLEET_MANAGER_PANEL_COPY_EMAIL,
  ): void {
    this.clipboard.copy(value);
    this.copiedValue.set(value);
    this.reportAnalytics(eventType);
  }

  public onCloseMenu(): void {
    this.trigger.closeMenu();
    this.copiedValue.set('');
    this.reportAnalytics(FleetAnalyticsEventType.FLEET_MANAGER_PANEL_CLOSED);
  }

  public reportAnalytics(eventType: FleetAnalyticsEventType): void {
    this.analytics.reportEvent(eventType, {
      user_access: this.storage.get(userRoleKey) ?? '',
      page: 'sidebar',
      description: ANALYTICS_DESCRIPTION.get(eventType) ?? '',
    });
  }
}
