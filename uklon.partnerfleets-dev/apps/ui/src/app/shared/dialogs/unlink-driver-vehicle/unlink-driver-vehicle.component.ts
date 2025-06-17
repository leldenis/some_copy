import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';

@Component({
  selector: 'upf-unlink-driver-vehicle',
  standalone: true,
  imports: [TranslateModule, MatIconButton, MatIcon, MatButton],
  templateUrl: './unlink-driver-vehicle.component.html',
  styleUrls: ['./unlink-driver-vehicle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnlinkDriverVehicleComponent {
  public amount: number;
  constructor(
    private readonly dialogRef: MatDialogRef<UnlinkDriverVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { placeholder: string; type: 'vehicle' | 'driver' },
    @Inject(ICONS) public icons: IconsConfig,
  ) {}

  public onAcceptClick(): void {
    this.dialogRef.close(true);
  }

  public onCancelClick(): void {
    this.dialogRef.close();
  }
}
