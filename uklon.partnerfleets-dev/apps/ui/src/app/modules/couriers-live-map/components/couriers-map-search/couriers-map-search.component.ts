import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MapCourierDetailsComponent } from '@ui/modules/couriers-live-map/components/map-courier-details/map-courier-details.component';
import { MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';

@Component({
  selector: 'upf-couriers-map-search',
  standalone: true,
  imports: [MatIcon, MatIconButton, TranslateModule, NgClass, MapCourierDetailsComponent],
  templateUrl: './couriers-map-search.component.html',
  styleUrls: ['./couriers-map-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersMapSearchComponent extends MapPanelBaseDirective {
  @Input() public employees: LiveMapEmployeeDto[];

  @Output() public selectEmployee = new EventEmitter<LiveMapEmployeeDto>();
  @Output() public closeSearch = new EventEmitter<void>();

  public onSelectEmployee(employee: LiveMapEmployeeDto): void {
    this.selectEmployee.emit(employee);
  }
}
