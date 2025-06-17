import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgControl } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { TicketFileUploadService } from '@ui/core/services/ticket-file-upload.service';
import { PhotoCardNewComponent, UIService } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { map } from 'rxjs/operators';

@Component({
  selector: 'upf-driver-avatar-control',
  standalone: true,
  imports: [
    MatIcon,
    MatMiniFabButton,
    MatProgressSpinner,
    NgClass,
    AsyncPipe,
    NgOptimizedImage,
    TranslateModule,
    LetDirective,
  ],
  templateUrl: './driver-avatar-control.component.html',
  styleUrl: './driver-avatar-control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverAvatarControlComponent extends PhotoCardNewComponent {
  public readonly diameter$ = this.uiService.breakpointMatch().pipe(map((match) => (match ? 122 : 180)));

  constructor(
    protected override readonly uiService: UIService,
    protected override readonly ticketFileUploadService: TicketFileUploadService,
    public override formControl: NgControl,
  ) {
    super(uiService, ticketFileUploadService, formControl);
  }
}
