import { Directive, ElementRef, HostListener, Inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

import { WINDOW } from '@uklon/angular-core';

@Directive({
  selector: '[upfDetectHeight]',
  standalone: true,
  providers: [{ provide: WINDOW, useValue: window }],
})
export class DetectHeightDirective implements OnChanges {
  @Input() public offset = 0;
  @Input() public shouldDetect = false;

  constructor(
    private readonly el: ElementRef,
    private readonly renderer: Renderer2,
    @Inject(WINDOW) private readonly window: Window,
  ) {}

  @HostListener('window:resize')
  public handleHeight(): void {
    if (this.shouldDetect) {
      this.setHeight();
    }
  }

  public ngOnChanges({ shouldDetect }: SimpleChanges): void {
    this.shouldDetect = shouldDetect?.currentValue;
    if (this.shouldDetect) {
      this.setHeight();
    } else {
      this.resetHeight();
    }
  }

  private setHeight(): void {
    const { innerHeight } = this.window;
    this.renderer.setStyle(this.el.nativeElement, 'height', `${innerHeight - this.offset}px`);
  }

  private resetHeight(): void {
    this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
  }
}
