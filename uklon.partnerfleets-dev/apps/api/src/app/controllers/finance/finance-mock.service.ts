import { DriverWalletsDto, InfinityScrollCollectionDto, PaymentCardDto, TransactionDto, WalletDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { Currency } from '@uklon/types';

@Injectable()
export class FinanceMockService {
  private readonly mockWallet: WalletDto = {
    id: '21fcsaf31r21',
    balance: {
      amount: 11_242,
      currency: Currency.UAH,
    },
  };

  private readonly mockPaymentCard: PaymentCardDto = {
    pan_truncated: '************3144',
    pan: '4184828405923144',
    card_id: '12312234xcfsdf',
  };

  private readonly mockWalletTransactions: InfinityScrollCollectionDto<TransactionDto> = {
    has_more_items: false,
    items: [
      {
        transaction_date: 1_603_053_241,
        transaction_type: 'vb_driver_balance_charge',
        balance_delta: {
          amount: -11_242,
          currency: Currency.UAH,
        },
        balance: {
          amount: 112_420,
          currency: Currency.UAH,
        },
      },
      {
        transaction_date: 1_603_063_241,
        transaction_type: 'vb_recharge_order_bonus_to_driver',
        balance_delta: {
          amount: 352,
          currency: Currency.UAH,
        },
        balance: {
          amount: 763_235,
          currency: Currency.UAH,
        },
      },
    ],
  };

  private readonly mockDriversWallets: DriverWalletsDto = {
    total_drivers_balance: {
      amount: 763_235,
      currency: Currency.UAH,
    },
    items: [
      {
        employee_id: '76423tgs2t',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '1',
          balance: {
            amount: -5312,
            currency: Currency.UAH,
          },
        },
      },
      {
        employee_id: 'gfsa6423rf',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '2',
          balance: {
            amount: -53_312,
            currency: Currency.UAH,
          },
        },
      },
      {
        employee_id: 'gdsg632gSdgdsg',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '3',
          balance: {
            amount: 6214,
            currency: Currency.UAH,
          },
        },
      },
      {
        employee_id: 'gdsg62532gSdgdsg',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '4',
          balance: {
            amount: 124,
            currency: Currency.UAH,
          },
        },
      },
      {
        employee_id: '73242fsdfsa',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '5',
          balance: {
            amount: 763_235,
            currency: Currency.UAH,
          },
        },
      },
      {
        employee_id: '73242fgsasdfsa',
        first_name: 'Alex',
        last_name: 'Arestovich',
        phone: '+380957771234',
        signal: 1,
        wallet: {
          id: '6',
          balance: {
            amount: 46_123,
            currency: Currency.UAH,
          },
        },
      },
    ],
  };

  public getFleetWallet(): Observable<WalletDto> {
    return of(this.mockWallet);
  }

  public getDriversWallets(): Observable<DriverWalletsDto> {
    return of(this.mockDriversWallets);
  }

  public getFleetPaymentCard(): Observable<PaymentCardDto> {
    return of(this.mockPaymentCard);
  }

  public putFleetPaymentCard(): Observable<void> {
    return of(null);
  }

  public deleteFleetPaymentCard(): Observable<void> {
    return of(null);
  }

  public sendVerificationCode(): Observable<void> {
    return of(null);
  }

  public withdrawToCard(): Observable<void> {
    return of(null);
  }

  public getFleetWalletTransactions(): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return of({ has_more_items: true, items: Array.from({ length: 20 }, () => this.mockWalletTransactions.items[0]) });
  }

  public getDriverTransactions(): Observable<InfinityScrollCollectionDto<TransactionDto>> {
    return of(this.mockWalletTransactions);
  }
}
