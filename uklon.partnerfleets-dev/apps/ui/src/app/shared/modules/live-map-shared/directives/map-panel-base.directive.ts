import { Directive, EventEmitter, Output } from '@angular/core';

import { LiveMapPanelType } from '../models';

@Directive({
  selector: '[upfMapPanelBase]',
  standalone: true,
})
export class MapPanelBaseDirective {
  @Output() public panelOpened = new EventEmitter<{ state: boolean; type: LiveMapPanelType }>();

  protected isOpened = true;
  public readonly panelType = LiveMapPanelType;

  protected togglePanelOpened(type: LiveMapPanelType): void {
    this.isOpened = !this.isOpened;
    this.panelOpened.emit({ state: this.isOpened, type });
  }
}
