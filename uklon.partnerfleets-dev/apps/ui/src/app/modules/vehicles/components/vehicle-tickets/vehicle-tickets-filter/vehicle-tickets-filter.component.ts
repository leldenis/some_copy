import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { TicketStatus } from '@constant';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { VehicleTicketsFilterDto } from '@ui/modules/vehicles/models/vehicle-tickets-filter.dto';
import { CustomValidators, MAT_FORM_FIELD_IMPORTS, MAT_SELECT_IMPORTS } from '@ui/shared';
import {
  FiltersActionButtonDirective,
  FiltersContainerComponent,
} from '@ui/shared/components/filters-container/filters-container.component';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  selector: 'upf-vehicle-tickets-filter',
  standalone: true,
  imports: [
    MAT_FORM_FIELD_IMPORTS,
    MAT_SELECT_IMPORTS,
    FiltersContainerComponent,
    ReactiveFormsModule,
    TranslateModule,
    MatIcon,
    RouterLink,
    FiltersActionButtonDirective,
    MatAnchor,
    NgTemplateOutlet,
    MatInput,
  ],
  templateUrl: './vehicle-tickets-filter.component.html',
  styleUrls: ['./vehicle-tickets-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTicketsFilterComponent {
  @Output() public filtersChange = new EventEmitter<VehicleTicketsFilterDto>();
  @Output() public addVehicle = new EventEmitter<void>();

  public readonly statusList = [
    TicketStatus.ALL,
    TicketStatus.DRAFT,
    TicketStatus.REVIEW,
    TicketStatus.CLARIFICATION,
    TicketStatus.SENT,
  ];
  public readonly ticketStatus = TicketStatus;
  public readonly vehiclePaths = VehiclePaths;
  public readonly filterKey = StorageFiltersKey.VEHICLE_TICKETS;
  public readonly filtersForm = new FormGroup({
    license_plate: new FormControl<string>('', [CustomValidators.licensePlate()]),
    status: new FormControl<TicketStatus | ''>(''),
  });

  public readonly icons = inject(ICONS);
}
