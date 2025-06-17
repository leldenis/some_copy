import { Component, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';
import { VehiclesState } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { paginationActions } from '@ui/shared/components/pagination/store/pagination.actions';
import { PaginationState } from '@ui/shared/components/pagination/store/pagination.reducer';

@Component({
  selector: 'upf-vehicles-root-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './vehicles-root-page.component.html',
  styleUrls: ['./vehicles-root-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesRootPageComponent implements OnDestroy {
  constructor(
    private readonly paginationStore: Store<PaginationState>,
    private readonly vehiclesStore: Store<VehiclesState>,
  ) {}

  public ngOnDestroy(): void {
    this.paginationStore.dispatch(paginationActions.clearState());
    this.vehiclesStore.dispatch(vehiclesActions.clearState());
  }
}
