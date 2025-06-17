import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FleetSignatureKeyDto } from '@data-access';
import { Store } from '@ngrx/store';
import {
  FleetKeyListComponent,
  OpenRemoveKeyPayload,
} from '@ui/modules/fleet-profile/features/fleet-rro/components/fleet-key-list/fleet-key-list.component';
import { fleetRROActions, FleetRROState, signatureKeys } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { UIService } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { Observable } from 'rxjs';

@Component({
  selector: 'upf-fleet-key-list-container',
  standalone: true,
  imports: [CommonModule, FleetKeyListComponent, EmptyStateComponent],
  templateUrl: './fleet-key-list-container.component.html',
  styleUrl: './fleet-key-list-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetKeyListContainerComponent implements OnInit {
  public readonly emptyState = EmptyStates;

  public readonly signatureKeys$ = this.store.select(signatureKeys);
  public readonly isMobileView$: Observable<boolean> = this.uiService.breakpointMatch();

  constructor(
    private readonly store: Store<FleetRROState>,
    private readonly uiService: UIService,
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(fleetRROActions.getSignatureKeys());
  }

  public handlerOpenRemoveKeyModal({ keyId, display_name }: OpenRemoveKeyPayload): void {
    this.store.dispatch(fleetRROActions.openRemoveKeyModal({ keyId, display_name }));
  }

  public handlerOpenKeyInfoModal(key: FleetSignatureKeyDto): void {
    this.store.dispatch(fleetRROActions.openKeyInfoModal({ key }));
  }

  public handlerOpenLinkCashToKeyModal(cashierId: string): void {
    this.store.dispatch(fleetRROActions.openLinkCashToKeyModal({ cashierId }));
  }
}
