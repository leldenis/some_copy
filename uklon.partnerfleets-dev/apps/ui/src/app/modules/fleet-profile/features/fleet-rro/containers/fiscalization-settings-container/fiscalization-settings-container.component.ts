import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  fiscalizationStatus,
  fleetRROActions,
  FleetRROState,
} from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { LetDirective } from '@ui/shared/directives/let.directive';

@Component({
  selector: 'upf-fiscalization-settings-container',
  standalone: true,
  imports: [CommonModule, LetDirective, MatButton, MatIcon, MatSlideToggle, TranslateModule, MatAnchor],
  templateUrl: './fiscalization-settings-container.component.html',
  styleUrl: './fiscalization-settings-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiscalizationSettingsContainerComponent {
  public fiscalizationStatus$ = this.store.select(fiscalizationStatus);

  constructor(private readonly store: Store<FleetRROState>) {}

  public openSettings(): void {
    this.store.dispatch(fleetRROActions.openFiscalizationSettingsDialog());
  }

  public toggleFiscalization(event: MatSlideToggleChange): void {
    // eslint-disable-next-line no-param-reassign
    event.source.checked = !event.checked;
    this.store.dispatch(fleetRROActions.toggleActivateFiscalization());
  }
}
