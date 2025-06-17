import { Platform } from '@angular/cdk/platform';
import { NgClass, SlicePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  HostBinding,
  inject,
  input,
  Output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountDto, FleetDetailsDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CorePaths } from '@ui/core/models/core-paths';
import { IndicatorComponent } from '@ui/shared';
import { NavigationRouteDto } from '@ui/shared/models';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { ICONS } from '@ui/shared/tokens';
import { EnvironmentModel } from '@ui-env/environment.model';
import moment from 'moment';

import { toClientDate } from '@uklon/angular-core';

import { ShellFleetMaintainerComponent } from '../shell-fleet-maintainer/shell-fleet-maintainer.component';

const IS_BETWEEN_DATES = (from: number, to: number): boolean => {
  return moment.utc().isBetween(moment.utc(toClientDate(from)), moment.utc(toClientDate(to)));
};

@Component({
  selector: 'upf-shell-navigation',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    NgClass,
    RouterLink,
    RouterLinkActive,
    SlicePipe,
    Id2ColorPipe,
    IndicatorComponent,
    TranslateModule,
    ShellFleetMaintainerComponent,
  ],
  templateUrl: './shell-navigation.component.html',
  styleUrl: './shell-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellNavigationComponent {
  @Output() public navigationChange = new EventEmitter<string>();
  @Output() public toggleSidebar = new EventEmitter<void>();
  @Output() public closeDrawer = new EventEmitter<void>();

  @HostBinding('class.desktop')
  public get isDesktop(): boolean {
    return !this.platform.IOS && !this.platform.ANDROID;
  }

  public routes = input.required<NavigationRouteDto[]>();
  public isMobileView = input.required<boolean>();
  public drawerOpened = input.required<boolean>();
  public fleetBlocked = input.required<boolean>();
  public account = input.required<AccountDto>();
  public appConfig = input.required<EnvironmentModel>();
  public showRROIndicator = input.required<boolean>();
  public fleetDetails = input.required<FleetDetailsDto>();
  public hasScroll = input<boolean>(false);

  public readonly accountRoute = CorePaths.ACCOUNT;
  public readonly displayMainMaintainer = computed(() => {
    if (!this.fleetDetails()?.maintainer) return false;

    const { absent_from, absent_to } = this.fleetDetails().maintainer;
    const display =
      (!absent_from && !absent_to) || (absent_from && absent_to && !IS_BETWEEN_DATES(absent_from, absent_to));
    return display ? { ...this.fleetDetails().maintainer, reserve: false } : false;
  });
  public readonly displayReserveMaintainer = computed(() => {
    if (!this.fleetDetails()?.reserve_maintainer || this.displayMainMaintainer()) {
      return false;
    }

    return { ...this.fleetDetails().reserve_maintainer, reserve: true };
  });
  public readonly absentTill = computed(() => {
    const absentTill = this.fleetDetails()?.maintainer?.absent_to;
    if (!absentTill) return '';

    return moment.utc(toClientDate(absentTill)).add(1, 'day').format('DD.MM.yyyy');
  });

  public readonly icons = inject(ICONS);
  public readonly platform = inject(Platform);
}
