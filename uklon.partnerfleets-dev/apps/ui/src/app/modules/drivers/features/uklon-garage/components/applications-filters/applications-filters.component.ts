import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { UklonGarageApplicationStatus } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { StorageFiltersKey } from '@ui/core/services/storage.service';
import { ApplicationsFiltersDto, FiltersFormGroupDto } from '@ui/modules/drivers/features/uklon-garage/models';
import { NotificationsQueryParamsDirective } from '@ui/shared';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { NgxMaskDirective } from 'ngx-mask';
import { ICONS } from '@ui/shared/tokens';

@Component({
  selector: 'upf-applications-filters',
  standalone: true,
  imports: [
    FiltersContainerComponent,
    FormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    MatSuffix,
    NgxMaskDirective,
    NotificationsQueryParamsDirective,
    ReactiveFormsModule,
    TranslateModule,
    KeyValuePipe,
  ],
  templateUrl: './applications-filters.component.html',
  styleUrl: './applications-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsFiltersComponent {
  @Output() public filtersChange = new EventEmitter<ApplicationsFiltersDto>();

  public readonly applicationStatus = UklonGarageApplicationStatus;
  public readonly filterKey = StorageFiltersKey.UKLON_GARAGE_APPLICATIONS;
  public readonly filtersForm = new FormGroup<FiltersFormGroupDto>({
    phone: new FormControl(''),
    status: new FormControl(''),
  });

  public readonly icons = inject(ICONS);
}
