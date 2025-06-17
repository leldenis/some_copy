import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { selectedFleetId } from '@ui/core/store/account/account.selectors';
import { CouriersContainerComponent } from '@ui/modules/couriers/containers/couriers-container/couriers-container.component';
import { NAMED_FRAGMENTS, NamedFragmentsDirective } from '@ui/shared';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';

@Component({
  selector: 'upf-couriers-page',
  standalone: true,
  imports: [
    InfiniteScrollDirective,
    AsyncPipe,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    TranslateModule,
    MatTabContent,
    CouriersContainerComponent,
  ],
  templateUrl: './couriers-page.component.html',
  styleUrls: ['./couriers-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['list'],
    },
  ],
})
export class CouriersPageComponent extends NamedFragmentsDirective {
  public fleetId$: Observable<string> = this.accountStore.select(selectedFleetId);

  constructor(
    private readonly accountStore: Store<AccountState>,
    @Inject(ICONS) public icons: IconsConfig,
  ) {
    super();
  }
}
