import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'upf-button-back',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, TranslateModule],
  templateUrl: './button-back.component.html',
  styleUrls: ['./button-back.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonBackComponent {
  @Input() public btnNameKey = 'Common.Buttons.B_Back';

  @Output() public navigateBack = new EventEmitter<void>();
}
