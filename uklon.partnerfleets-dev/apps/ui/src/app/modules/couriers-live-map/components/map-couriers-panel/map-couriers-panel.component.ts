import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MapCourierDetailsComponent } from '@ui/modules/couriers-live-map/components/map-courier-details/map-courier-details.component';
import { MapPanelBaseDirective, MapPanelState } from '@ui/shared/modules/live-map-shared';

@Component({
  selector: 'upf-map-couriers-panel',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslateModule, NgClass, MapCourierDetailsComponent],
  templateUrl: './map-couriers-panel.component.html',
  styleUrls: ['./map-couriers-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCouriersPanelComponent extends MapPanelBaseDirective {
  @Input() public employees: LiveMapEmployeeDto[];

  @Output() public selectEmployee = new EventEmitter<LiveMapEmployeeDto>();
  @Output() public goBack = new EventEmitter<void>();

  public readonly state = MapPanelState;

  public onSelectedEmployee(courier: LiveMapEmployeeDto): void {
    this.selectEmployee.emit(courier);
  }

  public onGoBack(): void {
    this.goBack.emit();
  }
}
