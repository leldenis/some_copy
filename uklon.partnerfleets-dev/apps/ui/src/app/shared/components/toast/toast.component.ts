import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

export enum ToastType {
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
}

@Component({
  selector: 'upf-toast',
  standalone: true,
  imports: [MatIconModule, TranslateModule, MatButtonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  public toastIcon = this.data.type === ToastType.SUCCESS ? 'check_circle' : 'error';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { type: ToastType; text: string; params: Record<string, unknown> },
    private readonly snackBar: MatSnackBarRef<ToastComponent>,
  ) {}

  public close(): void {
    this.snackBar.dismiss();
  }
}
