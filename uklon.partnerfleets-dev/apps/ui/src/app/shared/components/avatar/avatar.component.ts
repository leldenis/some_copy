import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DefaultImgSrcDirective } from '@ui/shared/directives/default-img-src/default-img-src.directive';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { Id2ColorPipe } from '@ui/shared/pipes/id-2-color/id-2-color.pipe';

import { UklAngularCoreModule } from '@uklon/angular-core';

const WIDTH_HEIGHT_SIZE = 14;
@Component({
  selector: 'upf-avatar',
  standalone: true,
  imports: [UklAngularCoreModule, Id2ColorPipe, LetDirective, DefaultImgSrcDirective],
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input() public id: string;
  @Input() public size = WIDTH_HEIGHT_SIZE;
  @Input() public src: string;
  @Input() public defaultSrc: string;
  @Input() public firstName: string;
  @Input() public lastName: string;
}
