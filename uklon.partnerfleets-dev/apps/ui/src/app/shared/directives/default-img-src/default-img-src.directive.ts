import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[upfDefaultImgSrc]',
  standalone: true,
})
export class DefaultImgSrcDirective {
  @Input() public src: string | SafeUrl;
  @Input() public defaultSrc: string | SafeUrl;

  @HostBinding('src')
  public get newSrc(): string | SafeUrl {
    return this.src;
  }

  @HostListener('error')
  public updateUrl(): void {
    this.src = this.defaultSrc;
  }
}
