import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import {
  FleetBalanceSplitModelDto,
  IndividualEntrepreneurDto,
  IndividualEntrepreneurCollectionDto,
} from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { EntrepreneurCardComponent } from '@ui/modules/finance/components/fleet-wallet-entrepreneur/components/entrepreneur-card/entrepreneur-card.component';
import { MerchantDialogComponent } from '@ui/modules/finance/components/fleet-wallet-entrepreneur/components/merchant-dialog/merchant-dialog.component';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { filter } from 'rxjs/operators';

const DIALOG_APPEARANCE = ['tw-h-auto', 'entrepreneur-dialog'];

@Component({
  selector: 'upf-fleet-entrepreneur',
  standalone: true,
  imports: [
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    EntrepreneurCardComponent,
    InfoPanelComponent,
  ],
  templateUrl: './fleet-entrepreneur.component.html',
  styleUrls: ['./fleet-entrepreneur.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetEntrepreneurComponent {
  @Input() public b2bActivated: boolean;
  @Input() public showFinanceSettings: boolean;
  @Input() public balanceSplitModel: FleetBalanceSplitModelDto;

  @Input() public set entrepreneurs(collection: IndividualEntrepreneurCollectionDto) {
    if (!collection) return;
    this.initVariables(collection);
  }

  @Output() public selectedEntrepreneurChange = new EventEmitter<IndividualEntrepreneurDto>();
  @Output() public loadBalanceSplitModel = new EventEmitter<void>();

  public selectedEntrepreneur: IndividualEntrepreneurDto;
  public availableEntrepreneurs: IndividualEntrepreneurDto[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef,
  ) {}

  public loadBalanceSplitSettings(): void {
    this.loadBalanceSplitModel.emit();
  }

  public openMerchantDialog(): void {
    this.dialog
      .open(MerchantDialogComponent, {
        panelClass: DIALOG_APPEARANCE,
        autoFocus: false,
        data: {
          b2bActivated: this.b2bActivated,
          availableEntrepreneurs: this.availableEntrepreneurs,
          selectedEntrepreneur: this.selectedEntrepreneur || [],
          showFinanceSettings: this.showFinanceSettings,
          balanceSplitModel: this.balanceSplitModel,
        },
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((entrepreneur) => {
        this.selectedEntrepreneur = entrepreneur;
        this.selectedEntrepreneurChange.emit(entrepreneur);
      });
  }

  private initVariables({ items }: IndividualEntrepreneurCollectionDto): void {
    this.availableEntrepreneurs = items;
    this.selectedEntrepreneur = items.find(({ is_selected }) => is_selected);
  }
}
