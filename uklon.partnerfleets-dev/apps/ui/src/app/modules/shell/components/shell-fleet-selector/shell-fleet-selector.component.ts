import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, NgClass, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FleetDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { RegionByIdPipe } from '@ui/modules/fleet-profile/features/fleet-history/pipes/region-by-id.pipe';
import { GROW_VERTICAL } from '@ui/shared';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';
import { ICONS } from '@ui/shared/tokens';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@Component({
  selector: 'upf-shell-fleet-selector',
  standalone: true,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatIconButton,
    MatMenuContent,
    MatMenuTrigger,
    NgClass,
    AsyncPipe,
    SlicePipe,
    Id2ColorPipe,
    RegionByIdPipe,
    NgxTippyModule,
    TranslateModule,
  ],
  templateUrl: './shell-fleet-selector.component.html',
  styleUrl: './shell-fleet-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class ShellFleetSelectorComponent {
  @Output() public menuOpened = new EventEmitter<void>();
  @Output() public fleetSelected = new EventEmitter<FleetDto>();

  public fleets = input.required<FleetDto[]>();
  public selectedFleet = input.required<FleetDto>();
  public notificationsCount = input.required<Record<string, number>>();
  public isMobileView = input.required<boolean>();

  public readonly opened = signal<boolean>(false);
  public readonly copiedId = signal<string>('');

  public readonly icons = inject(ICONS);
  public readonly clipboard = inject(Clipboard);

  public toggleMenuOpened(opened: boolean): void {
    this.opened.set(opened);

    if (opened) {
      this.menuOpened.emit();
      return;
    }

    this.copiedId.set('');
  }

  public onCopyFleetId(event: MouseEvent, fleetId: string): void {
    event.stopPropagation();

    this.clipboard.copy(fleetId);
    this.copiedId.set(fleetId);
  }

  public onSelectFleet(fleet: FleetDto): void {
    this.fleetSelected.emit(fleet);
  }
}
