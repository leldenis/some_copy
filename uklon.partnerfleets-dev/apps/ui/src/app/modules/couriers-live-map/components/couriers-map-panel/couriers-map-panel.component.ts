import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LiveMapEmployeeDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { GET_MAP_PANEL_GROUPS, LiveMapPanelGroupDto, MapPanelBaseDirective } from '@ui/shared/modules/live-map-shared';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-couriers-map-panel',
  standalone: true,
  imports: [LetDirective, TranslateModule, MatIcon, NgClass, NgxTippyModule],
  templateUrl: './couriers-map-panel.component.html',
  styleUrls: ['./couriers-map-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouriersMapPanelComponent extends MapPanelBaseDirective {
  @Input() public set couriers(data: LiveMapEmployeeDto[]) {
    this.totalCouriers = data.length;
    this.groupCouriers(data);
  }

  @Output() public selectedGroup = new EventEmitter<LiveMapEmployeeDto[]>();

  public groupsConfig: LiveMapPanelGroupDto[] = GET_MAP_PANEL_GROUPS();
  public totalCouriers: number;

  public onSelectGroup(couriers: LiveMapEmployeeDto[]): void {
    if (couriers.length === 0) return;
    this.selectedGroup.emit(couriers);
  }

  private groupCouriers(couriers: LiveMapEmployeeDto[]): void {
    const groups: LiveMapPanelGroupDto[] = GET_MAP_PANEL_GROUPS();

    couriers.forEach((courier) => {
      const index = groups.findIndex(({ status }) => status === courier.status);
      if (index !== -1) {
        groups[index].data.push(courier);
      }
    });

    groups.forEach(({ data }) => data.sort((a, b) => a.last_name.localeCompare(b.last_name)));
    this.groupsConfig = groups;
  }
}
