import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { FleetBalanceSplitModelDto, IndividualEntrepreneurDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { EntrepreneurCardComponent } from '@ui/modules/finance/components/fleet-wallet-entrepreneur/components/entrepreneur-card/entrepreneur-card.component';
import { EntrepreneurFinanceSettingsComponent } from '@ui/modules/finance/components/fleet-wallet-entrepreneur/components/entrepreneur-finance-settings/entrepreneur-finance-settings.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';

export interface MerchantDialogData {
  b2bActivated: boolean;
  availableEntrepreneurs: IndividualEntrepreneurDto[];
  selectedEntrepreneur: IndividualEntrepreneurDto;
  balanceSplitModel: FleetBalanceSplitModelDto;
  showFinanceSettings?: boolean;
}

@Component({
  selector: 'upf-merchant-dialog',
  standalone: true,
  imports: [
    LetDirective,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    TranslateModule,
    ReactiveFormsModule,
    EntrepreneurCardComponent,
    EntrepreneurFinanceSettingsComponent,
    InfoPanelComponent,
  ],
  templateUrl: './merchant-dialog.component.html',
  styleUrl: './merchant-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantDialogComponent implements OnInit {
  public entrepreneurControl = new FormControl<IndividualEntrepreneurDto>(null);

  constructor(
    private readonly dialogRef: MatDialogRef<MerchantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MerchantDialogData,
  ) {}

  public ngOnInit(): void {
    this.entrepreneurControl.setValue(this.data.selectedEntrepreneur);
  }

  public dialogClose(selectedEntrepreneur?: IndividualEntrepreneurDto): void {
    this.dialogRef.close(selectedEntrepreneur);
  }
}
