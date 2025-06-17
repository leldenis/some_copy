import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

export type StatusColor = 'success' | 'warn' | 'error' | 'accent' | 'neutral' | 'primary';

@Component({
  selector: 'upf-status-badge',
  standalone: true,
  template: '<ng-content></ng-content>',
  styleUrls: ['./status-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusBadgeComponent {
  @Input() public color: StatusColor = 'neutral';

  @HostBinding('class')
  public get class(): StatusColor {
    return this.color;
  }
}
