import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CouriersFiltersDto, CourierItemDto } from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { getConfig } from '@ui/core/store/root/root.selectors';
import { CouriersListComponent } from '@ui/modules/couriers/components/couriers-list/couriers-list.component';
import { CouriersService } from '@ui/modules/couriers/services/couriers.service';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { EmptyStates } from '@ui/shared/components/empty-state/empty-states';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { DEFAULT_LIMIT } from '@ui/shared/consts';
import { ICONS } from '@ui/shared/tokens';
import { BehaviorSubject, map } from 'rxjs';

import { ScrolledDirectiveModule } from '@uklon/fleets/angular/cdk';

@Component({
  selector: 'upf-couriers-container',
  standalone: true,
  imports: [
    CommonModule,
    ScrolledDirectiveModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    TranslateModule,
    CouriersListComponent,
    FiltersContainerComponent,
    FiltersActionButtonDirective,
    MatButtonModule,
    EmptyStateComponent,
  ],
  templateUrl: './couriers-container.component.html',
  styleUrls: ['./couriers-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersContainerComponent {
  @Input() public fleetId: string;

  public readonly emptyState = EmptyStates;
  public readonly filterKey = StorageFiltersKey.COURIERS_LIST;

  public readonly filtersGroup = new FormGroup({
    name: new FormControl<string>(''),
    phone: new FormControl<string>(''),
  });

  public readonly icons = inject(ICONS);
  public readonly couriersService = inject(CouriersService);
  public readonly store = inject(Store);

  public readonly registrationLink$ = this.store.select(getConfig).pipe(map((cfg) => cfg?.externalLinks?.registration));
  public readonly couriers$ = new BehaviorSubject<CourierItemDto[]>(null);

  private isLoading = false;
  private hasNext = false;
  private cursor = 0;

  public onFiltersChange(filters: CouriersFiltersDto): void {
    if (!filters) {
      return;
    }

    this.cursor = 0;
    this.getFleetCouriers(filters);
  }

  public onLoadNext(): void {
    if (!this.hasNext || this.isLoading) {
      return;
    }

    this.getFleetCouriers(this.filtersGroup.getRawValue(), true);
  }

  private getFleetCouriers(filters: CouriersFiltersDto, loadMore = false): void {
    this.isLoading = true;
    this.couriersService
      .getFleetCouriers(this.fleetId, {
        ...filters,
        cursor: String(this.cursor),
        limit: DEFAULT_LIMIT,
      })
      .subscribe(({ next_cursor, items }) => {
        this.hasNext = !!Number(next_cursor);
        this.cursor = Number(next_cursor) || 0;
        const couriers = loadMore ? [...this.couriers$.value, ...items] : items;
        this.couriers$.next(couriers);
        this.isLoading = false;
      });
  }
}
