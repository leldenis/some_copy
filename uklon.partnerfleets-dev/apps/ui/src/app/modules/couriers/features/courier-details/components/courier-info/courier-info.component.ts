import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarComponent } from '@ui/shared/components/avatar/avatar.component';

@Component({
  selector: 'upf-courier-info',
  standalone: true,
  imports: [TranslateModule, AvatarComponent],
  templateUrl: './courier-info.component.html',
  styleUrls: ['./courier-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourierInfoComponent {
  @Input() public id: string;
  @Input() public avatarLink: string;
  @Input() public firstName: string;
  @Input() public lastName: string;
}
