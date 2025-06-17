import { FormControl } from '@angular/forms';

export interface FiltersFormGroupDto {
  phone: FormControl<string>;
  status: FormControl<string>;
}

export interface ApplicationsFiltersDto {
  phone: string;
  status: string;
}
