import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { MapDriverDetailsComponent } from '@ui/modules/live-map/components/map-driver-details/map-driver-details.component';
import { MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';

@Component({
  selector: 'upf-map-drivers-panel',
  standalone: true,
  imports: [MatIconButton, MatIcon, TranslateModule, NgClass, MapDriverDetailsComponent],
  templateUrl: './map-drivers-panel.component.html',
  styleUrls: ['./map-drivers-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDriversPanelComponent extends MapPanelBaseDirective {
  public readonly employees = input.required<LiveMapEmployeeDto[]>();

  public readonly goBack = output();
  public readonly selectEmployee = output<LiveMapEmployeeDto>();
  public readonly showActiveFilters = output<string>();

  public onSelectDriver(driver: LiveMapEmployeeDto): void {
    this.selectEmployee.emit(driver);
  }

  public onGoBack(): void {
    this.goBack.emit();
  }
}
