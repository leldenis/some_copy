import { AfterViewInit, Directive, ElementRef, Input, signal } from '@angular/core';

@Directive({
  selector: '[upfHasScroll]',
  standalone: true,
  exportAs: 'upfHasScroll',
})
export class HasScrollDirective implements AfterViewInit {
  @Input() public upfHasScroll: 'vertical' | 'horizontal';

  public readonly hasScroll = signal<boolean>(false);

  constructor(private readonly el: ElementRef) {}

  public ngAfterViewInit(): void {
    const { offsetHeight, scrollHeight, offsetWidth, scrollWidth } = this.el.nativeElement;
    const hasScroll = this.upfHasScroll === 'vertical' ? scrollHeight > offsetHeight : offsetWidth < scrollWidth;
    this.hasScroll.set(hasScroll);
  }
}
