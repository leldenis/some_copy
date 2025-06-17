import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'upf-popover',
  standalone: true,
  imports: [CommonModule, MatIcon, NgxTippyModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  @Output() public popoverOpened = new EventEmitter<boolean>();

  public isOpened$ = new BehaviorSubject<boolean>(false);
  public readonly props = {
    trigger: 'click',
    interactive: true,
    appendTo: this.document.body,
    onShow: (): void => this.onTooltipStateChange(true),
    onHide: (): void => this.onTooltipStateChange(false),
  };

  constructor(@Inject(DOCUMENT) public readonly document: Document) {}

  private onTooltipStateChange(opened: boolean): void {
    this.isOpened$.next(opened);
    this.popoverOpened.emit(opened);
  }
}
