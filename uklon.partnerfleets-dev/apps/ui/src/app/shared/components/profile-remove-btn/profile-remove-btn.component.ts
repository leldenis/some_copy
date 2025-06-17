import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'upf-profile-remove-btn',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './profile-remove-btn.component.html',
  styleUrls: ['./profile-remove-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileRemoveBtnComponent {
  @Input() public btnName: string;
  @Output() public remove = new EventEmitter<void>();
}
