import { PaymentCardDto } from '@data-access';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  card_id?: string;
  is_empty?: boolean;
}>;

export class FleetPaymentCardModule extends ModuleBase<PaymentCardDto> {
  public buildDto(props?: BuildProps): PaymentCardDto {
    return props?.is_empty
      ? {
          pan_truncated: null,
          pan: null,
          card_id: null,
        }
      : this.buildCard(props?.card_id ?? this.faker.string.uuid());
  }
  private buildCard(cardId: string): { pan_truncated: string; pan: string; card_id: string } {
    return {
      pan_truncated: '44****6666',
      pan: '4444555511116666',
      card_id: cardId,
    };
  }
}
