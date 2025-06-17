import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FleetFiscalizationSettingsDto } from '@data-access';
import { Store } from '@ngrx/store';
import { FleetProfileTabs } from '@ui/modules/fleet-profile/containers/fleet-profile-tabs/fleet-profile-tabs.component';
import { FiscalizationSettingsContainerComponent } from '@ui/modules/fleet-profile/features/fleet-rro/containers/fiscalization-settings-container/fiscalization-settings-container.component';
import { FleetKeyListContainerComponent } from '@ui/modules/fleet-profile/features/fleet-rro/containers/fleet-key-list-container/fleet-key-list-container.component';
import { FleetVehiclesContainerComponent } from '@ui/modules/fleet-profile/features/fleet-rro/containers/fleet-vehicles-container/fleet-vehicles-container.component';
import {
  RroButtonToggleContainerComponent,
  RROTab,
} from '@ui/modules/fleet-profile/features/fleet-rro/containers/rro-button-toggle-container/rro-button-toggle-container.component';
import { ProfileIndicatorService } from '@ui/modules/fleet-profile/features/fleet-rro/services';
import { fleetRROActions } from '@ui/modules/fleet-profile/features/fleet-rro/store';
import { FleetRROState } from '@ui/modules/fleet-profile/features/fleet-rro/store/rro.reducer';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'upf-fleet-rro-container',
  standalone: true,
  imports: [
    FiscalizationSettingsContainerComponent,
    RroButtonToggleContainerComponent,
    AsyncPipe,
    FleetKeyListContainerComponent,
    FleetVehiclesContainerComponent,
  ],
  templateUrl: './fleet-rro-container.component.html',
  styleUrl: './fleet-rro-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetRROContainerComponent implements OnChanges, OnInit {
  @Input({ required: true }) public fleetId: string;
  @Input({ required: true }) public settings: FleetFiscalizationSettingsDto;
  @Input({ required: true }) public b2bActivated: boolean;

  public readonly activeTab$ = new BehaviorSubject<RROTab>(RROTab.KEYS);
  public readonly emptyState = EmptyStates;

  constructor(
    private readonly profileIndicatorService: ProfileIndicatorService,
    private readonly store: Store<FleetRROState>,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnChanges({ fleetId }: SimpleChanges): void {
    if (!fleetId?.firstChange && fleetId?.currentValue !== fleetId?.previousValue) {
      this.getFiscalizationSettings();
      this.getSignatureKeys();
    }

    if (fleetId?.currentValue !== fleetId?.previousValue) {
      this.profileIndicatorService.hide(this.fleetId);
    }
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged(),
        switchMap(() => this.activatedRoute.queryParams),
      )
      .subscribe((params) => {
        this.handlerToggleTab(params['tab']);
      });

    this.handlerToggleTab(this.activatedRoute.snapshot.queryParams['tab'] || RROTab.KEYS);

    if (!this.settings) {
      this.getFiscalizationSettings();
    }
  }

  public handlerToggleTab(tab: RROTab): void {
    this.activeTab$.next(tab);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      fragment: FleetProfileTabs.RRO,
      queryParams: { tab },
    });
  }

  public openUploadSignatureKeyModal(): void {
    this.store.dispatch(fleetRROActions.openUploadSignatureKeyModal());
  }

  private getFiscalizationSettings(): void {
    this.store.dispatch(fleetRROActions.getFiscalizationSettings());
    this.store.dispatch(fleetRROActions.getFiscalizationStatus());
  }

  private getSignatureKeys(): void {
    this.store.dispatch(fleetRROActions.getSignatureKeys());
  }
}
