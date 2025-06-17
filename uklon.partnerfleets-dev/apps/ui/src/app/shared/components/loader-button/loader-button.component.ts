import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  selector: 'upf-loader-button',
  templateUrl: './loader-button.component.html',
  styleUrls: ['./loader-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderButtonComponent {
  @Input() public type: 'button' | 'submit' = 'submit';
  @Input() public color: ThemePalette = 'primary';
  @Input() public loading: boolean;
  @Input() public disabled: boolean;
  @Input() public hasSpinner = true;
  @Input() public dataCY = '';

  @Output() public handlerClick = new EventEmitter<boolean>();

  constructor(@Inject(ICONS) public icons: IconsConfig) {}

  public handlerButtonClick(): void {
    if (this.loading || this.disabled) {
      return;
    }

    this.handlerClick.emit();
  }
}
