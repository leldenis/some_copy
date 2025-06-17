import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { IndividualEntrepreneurDto } from '@data-access';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'upf-entrepreneur-card',
  standalone: true,
  imports: [CommonModule, MatIcon, TranslateModule, MatIconButton, MatMenu, MatMenuItem, MatMenuTrigger],
  templateUrl: './entrepreneur-card.component.html',
  styleUrl: './entrepreneur-card.component.scss',
  providers: [TranslateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntrepreneurCardComponent {
  @Input() public selectedEntrepreneur: IndividualEntrepreneurDto;
  @Input() public showMerchantDetails = false;
  @Input() public showMenu = false;

  @Output() public handlerOpenMenu = new EventEmitter<void>();
  @Output() public handlerMenuClick = new EventEmitter<void>();
}
