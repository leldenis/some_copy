import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { ScrolledDirective } from './scrolled.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ScrolledDirective],
  exports: [ScrolledDirective],
  providers: [InfiniteScrollDirective],
})
export class ScrolledDirectiveModule {}
