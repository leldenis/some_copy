import { animate, state, style, transition, trigger, AnimationEvent } from '@angular/animations';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  InfoPanelIconDirective,
  InfoPanelSubtitleDirective,
  InfoPanelTitleDirective,
} from '@ui/shared/modules/info-panel/directives';

export type PanelColor = 'success' | 'warn' | 'error' | 'accent' | 'neutral' | 'primary';
export type PanelHeight = `${number}px`;

const SUBTITLE_PANEL_HEIGHT: PanelHeight = '64px';
const NO_SUBTITLE_PANEL_HEIGHT: PanelHeight = '38px';

@Component({
  selector: 'upf-info-panel',
  standalone: true,
  imports: [NgTemplateOutlet, NgClass, MatIcon],
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('expand', [
      state(
        'false',
        style({
          height: `{{ height }}`,
        }),
        {
          params: { height: NO_SUBTITLE_PANEL_HEIGHT },
        },
      ),
      state(
        'true',
        style({
          height: '*',
        }),
      ),
      transition('false => true', animate('150ms ease-in-out')),
      transition('true => false', animate('150ms ease-in-out')),
    ]),
  ],
})
export class InfoPanelComponent {
  @ContentChild(InfoPanelTitleDirective, { read: TemplateRef })
  public title: TemplateRef<HTMLElement>;

  @ContentChild(InfoPanelSubtitleDirective, { read: TemplateRef })
  public subtitle: TemplateRef<HTMLElement>;

  @ContentChild(InfoPanelIconDirective, { read: TemplateRef })
  public icon: TemplateRef<HTMLElement>;

  @Input() public color: PanelColor;
  @Input() public expanded = true;
  @Input() public hideToggle = true;
  @Input() public collapsedHeight: PanelHeight;
  @Input() public hideInfoIcon = false;

  @Output() public afterClosed = new EventEmitter<void>();
  @Output() public afterOpened = new EventEmitter<void>();

  @HostBinding('class')
  public get class(): PanelColor {
    return this.color;
  }

  @HostBinding('@expand')
  public get expand(): { value: boolean; params: { height: string } } {
    const heightWithSubtitle = this.subtitle ? SUBTITLE_PANEL_HEIGHT : NO_SUBTITLE_PANEL_HEIGHT;
    const height = this.collapsedHeight ?? heightWithSubtitle;

    return {
      value: this.expanded,
      params: { height },
    };
  }

  @HostListener('@expand.done', ['$event'])
  public animationDone({ toState }: AnimationEvent): void {
    toState ? this.afterOpened.emit() : this.afterClosed.emit();
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }
}
