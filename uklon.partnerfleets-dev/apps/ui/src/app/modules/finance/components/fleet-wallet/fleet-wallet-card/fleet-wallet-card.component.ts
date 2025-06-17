import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { PaymentCardDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { CardPanPipe } from '@ui/shared';

const MASTERCARD_PATTERN = /(5[1-5]\d{14})/g;
const VISA_PATTERN = /(4\d{15})/g;

@Component({
  selector: 'upf-fleet-wallet-card',
  standalone: true,
  imports: [
    MatIcon,
    TranslateModule,
    CardPanPipe,
    MatIconButton,
    MatMenuTrigger,
    LowerCasePipe,
    MatButton,
    MatMenu,
    MatMenuItem,
  ],
  templateUrl: './fleet-wallet-card.component.html',
  styleUrls: ['./fleet-wallet-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FleetWalletCardComponent {
  @Input() public set card(data: PaymentCardDto) {
    this.cardData = data;
    this.detectCardVendor(data);
  }

  @Output() public addCard = new EventEmitter<void>();
  @Output() public deleteCard = new EventEmitter<PaymentCardDto>();

  public vendor!: 'i-mastercard' | 'i-visa';
  public cardData: PaymentCardDto;

  public handleAddCardClick(): void {
    this.addCard.emit();
  }

  public handleDeleteCardClick(): void {
    this.deleteCard.emit(this.cardData);
  }

  private detectCardVendor(card: PaymentCardDto): void {
    if (MASTERCARD_PATTERN.test(card?.pan)) {
      this.vendor = 'i-mastercard';
    } else if (VISA_PATTERN.test(card?.pan)) {
      this.vendor = 'i-visa';
    } else {
      this.vendor = null;
    }
  }
}
