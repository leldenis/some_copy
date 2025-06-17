import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FinanceService } from '@ui/modules/finance/services';
import { cleanGuid } from '@ui/shared/utils/clean-guid';
import { combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentChannels {
  public readonly paymentProviderNames = signal<Record<string, string>>({});

  private readonly financeService = inject(FinanceService);
  private readonly destroyRef = inject(DestroyRef);

  public getPaymentChannels(value: string[]): void {
    const paymentChannelIds = [
      ...new Set(value.filter(Boolean).filter((item) => !this.paymentProviderNames().hasOwnProperty(cleanGuid(item)))),
    ];

    if (paymentChannelIds?.length > 0) {
      combineLatest(paymentChannelIds.map((item) => this.financeService.getPaymentChannel(item)))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((items) => {
          const data: Record<string, string> = {};
          items.forEach((item) => {
            data[cleanGuid(item.id)] = item.name;
          });

          this.paymentProviderNames.update((source) => {
            return {
              ...source,
              ...data,
            };
          });
        });
    }
  }
}
