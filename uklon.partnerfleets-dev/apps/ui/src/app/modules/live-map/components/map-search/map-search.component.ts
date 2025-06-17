import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MapDriverDetailsComponent } from '@ui/modules/live-map/components/map-driver-details/map-driver-details.component';
import { MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';

@Component({
  selector: 'upf-map-search',
  standalone: true,
  imports: [MatIcon, MatIconButton, TranslateModule, NgClass, MapDriverDetailsComponent],
  templateUrl: './map-search.component.html',
  styleUrls: ['./map-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapSearchComponent extends MapPanelBaseDirective {
  public readonly employees = input.required<LiveMapEmployeeDto[]>();

  public readonly closeSearch = output();
  public readonly showActiveFilters = output<string>();
  public readonly selectedEmployee = output<LiveMapEmployeeDto>();

  public onSelectEmployee(employee: LiveMapEmployeeDto): void {
    this.selectedEmployee.emit(employee);
  }
}
