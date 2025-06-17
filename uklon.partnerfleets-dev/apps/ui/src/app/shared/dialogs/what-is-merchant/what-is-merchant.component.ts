import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { InfoPanelComponent } from '@ui/shared/modules/info-panel/components/info-panel/info-panel.component';
import { InfoPanelTitleDirective } from '@ui/shared/modules/info-panel/directives';

@Component({
  selector: 'upf-what-is-merchant',
  templateUrl: './what-is-merchant.component.html',
  styleUrls: ['./what-is-merchant.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    MatDialogModule,
    MatDividerModule,
    InfoPanelComponent,
    InfoPanelTitleDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatIsMerchantComponent {
  @ViewChild('dialog')
  public dialogTemplate: TemplateRef<HTMLElement>;

  constructor(private readonly dialog: MatDialog) {}

  public showMerchantDialog(): void {
    this.dialog.open(this.dialogTemplate, {
      panelClass: 'merchant-info-dialog',
    });
  }
}
