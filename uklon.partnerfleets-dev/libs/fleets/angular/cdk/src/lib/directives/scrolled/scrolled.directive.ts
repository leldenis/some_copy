import { Directive, Output } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Directive({
  selector: '[cdkScrolled]',
})
export class ScrolledDirective {
  @Output('cdkScrolled')
  public readonly scrolled = this.infiniteScrollDirective.scrolled;

  constructor(private readonly infiniteScrollDirective: InfiniteScrollDirective) {}
}
