import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { GET_MAP_PANEL_GROUPS, LiveMapPanelGroupDto, MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-map-panel',
  standalone: true,
  imports: [MatIcon, TranslateModule, NgClass, NgxTippyModule, LetDirective],
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPanelComponent extends MapPanelBaseDirective {
  @Input() public set employees(data: LiveMapEmployeeDto[]) {
    this.totalEmployees = data?.length;
    this.groupEmployees(data);
  }

  @Output() public selectedGroup = new EventEmitter<LiveMapEmployeeDto[]>();

  public groupsConfig: LiveMapPanelGroupDto[] = GET_MAP_PANEL_GROUPS();
  public totalEmployees: number;

  public onSelectGroup(employees: LiveMapEmployeeDto[]): void {
    if (employees?.length === 0) return;
    this.selectedGroup.emit(employees);
  }

  private groupEmployees(employees: LiveMapEmployeeDto[]): void {
    const groups: LiveMapPanelGroupDto[] = GET_MAP_PANEL_GROUPS();

    employees.forEach((employee) => {
      const index = groups.findIndex(({ status }) => status === employee?.status);
      if (index !== -1) {
        groups[index].data.push(employee);
      }
    });

    groups.forEach(({ data }) => data.sort((a, b) => a.last_name.localeCompare(b.last_name)));
    this.groupsConfig = groups;
  }
}
