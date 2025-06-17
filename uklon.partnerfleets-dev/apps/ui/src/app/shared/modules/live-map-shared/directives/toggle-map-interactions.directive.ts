import { Directive, HostListener } from '@angular/core';

import { LiveMapService } from '../services';

@Directive({
  selector: '[upfToggleMapInteractions]',
  standalone: true,
})
export class ToggleMapInteractionsDirective {
  constructor(private readonly mapService: LiveMapService) {}

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.toggleMapInteractions(false);
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.toggleMapInteractions(true);
  }

  @HostListener('pointerdown')
  public onPointerDown(): void {
    this.toggleMapInteractions(false);
  }

  private toggleMapInteractions(enable: boolean): void {
    this.mapService.toggleMapInteractions(enable);
  }
}
