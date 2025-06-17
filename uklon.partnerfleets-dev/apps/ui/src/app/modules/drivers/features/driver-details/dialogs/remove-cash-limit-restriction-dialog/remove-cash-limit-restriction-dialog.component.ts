import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

@Component({
  selector: 'upf-remove-cash-limit-restriction-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatIconButton,
    MatDialogClose,
    MatButton,
    TranslateModule,
    MatRadioGroup,
    MatRadioButton,
    ReactiveFormsModule,
    InfoPanelComponent,
  ],
  templateUrl: './remove-cash-limit-restriction-dialog.component.html',
  styleUrl: './remove-cash-limit-restriction-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveCashLimitRestrictionDialogComponent {
  @HostBinding('attr.data-cy') private readonly attribute = 'cash-limits-restriction-dialog';

  public readonly resetForm = new FormGroup({
    with_reset_limit: new FormControl(true),
  });
}
