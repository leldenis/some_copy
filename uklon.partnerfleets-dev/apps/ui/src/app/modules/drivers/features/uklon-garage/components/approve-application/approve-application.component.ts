import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface DialogData {
  title: string;
  content: string;
  okBtn: string;
  cancelBtn: string;
  approve: boolean;
}

@Component({
  selector: 'upf-approve-application',
  standalone: true,
  imports: [MatButton, MatIconButton, MatIcon, MatDialogClose, TranslateModule],
  templateUrl: './approve-application.component.html',
  styleUrl: './approve-application.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApproveApplicationComponent {
  public readonly data: DialogData = inject(MAT_DIALOG_DATA);
}
