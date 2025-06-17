import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { FleetSignatureKeyDto, FleetSignatureKeysCollection } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { KeyDeadlinePipe, KeyMaskPipe } from '@ui/modules/fleet-profile/features/fleet-rro/pipes';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { IconsConfig } from '@ui/shared/tokens/icons.config';
import { ICONS } from '@ui/shared/tokens/icons.token';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

export interface OpenRemoveKeyPayload {
  keyId: string;
  display_name: string;
}

@Component({
  selector: 'upf-fleet-key-list',
  standalone: true,
  imports: [
    NgClass,
    NgTemplateOutlet,
    MatAccordion,
    TranslateModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    KeyMaskPipe,
    MatIcon,
    MatIconButton,
    MatDivider,
    NgxTippyModule,
    KeyDeadlinePipe,
    Seconds2DatePipe,
  ],
  templateUrl: './fleet-key-list.component.html',
  styleUrl: './fleet-key-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetKeyListComponent {
  @Input({ required: true }) public keys: FleetSignatureKeysCollection;
  @Input({ required: true }) public isMobileView: boolean;

  @Output() public openRemoveKeyModal = new EventEmitter<OpenRemoveKeyPayload>();
  @Output() public openKeyInfoModal = new EventEmitter<FleetSignatureKeyDto>();
  @Output() public openLinkCashToKeyModal = new EventEmitter<string>();

  constructor(@Inject(ICONS) public icons: IconsConfig) {}

  public handlerOpenRemoveKeyModal(keyId: string, display_name = ''): void {
    this.openRemoveKeyModal.emit({ keyId, display_name });
  }

  public handlerOpenKeyInfoModal(key: FleetSignatureKeyDto): void {
    this.openKeyInfoModal.emit(key);
  }

  public handlerOpenLinkCashToKeyModal(cashierId: string): void {
    this.openLinkCashToKeyModal.emit(cashierId);
  }
}
