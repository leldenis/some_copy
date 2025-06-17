import { DriversOrdersReportDto, InfinityScrollCollectionDto, MoneyDto } from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../_internal';

const EVENT_DEFAULT_COUNT = 5;

export type BuildProps = Partial<{
  items?: DriversOrdersReportDto[];
  has_more_items?: boolean;
  orders_count?: number;
}>;

export class FleetOrdersReportsModule extends ModuleBase<InfinityScrollCollectionDto<DriversOrdersReportDto>> {
  public buildDto(props?: BuildProps): InfinityScrollCollectionDto<DriversOrdersReportDto> {
    return {
      has_more_items: props?.has_more_items ?? false,
      items:
        props.items ??
        Array.from({ length: props?.orders_count ?? EVENT_DEFAULT_COUNT }).map((_, index) =>
          this.buildEvent.bind(index, this),
        ),
    };
  }

  private buildEvent(): DriversOrdersReportDto {
    return {
      driver: {
        first_name: this.faker.person.firstName(),
        last_name: this.faker.person.lastName(),
        id: this.faker.string.uuid(),
        signal: 500_265,
      },
      total_orders_count: this.faker.number.int({ max: 100 }),
      total_distance_meters: this.faker.number.int({ max: 100_000 }),
      total_distance_to_pickup_meters: this.faker.number.int({ max: 1000 }),
      total_executing_time: this.faker.number.int({ max: 1000 }),
      average_price_per_kilometer: this.getMoney(this.faker.number.int({ max: 100 })),
      average_order_price_per_kilometer: this.getMoney(this.faker.number.int({ max: 100 })),
      average_order_price_per_hour: this.getMoney(this.faker.number.int({ max: 100 })),
      orders_per_hour: this.faker.number.int({ max: 5 }),
      bonuses: {
        branding: this.getMoney(this.faker.number.int({ max: 10_000 })),
        guaranteed: this.getMoney(this.faker.number.int({ max: 10_000 })),
        individual: this.getMoney(this.faker.number.int({ max: 10_000 })),
        order: this.getMoney(this.faker.number.int({ max: 10_000 })),
        total: this.getMoney(this.faker.number.int({ max: 10_000 })),
        week: this.getMoney(this.faker.number.int({ max: 10_000 })),
      },
      compensation: {
        absence: this.getMoney(this.faker.number.int({ max: 100 })),
        ticket: this.getMoney(this.faker.number.int({ max: 100 })),
        total: this.getMoney(this.faker.number.int({ max: 100 })),
      },
      tips: this.getMoney(this.faker.number.int({ max: 1000 })),
      penalties: this.getMoney(this.faker.number.int({ max: 100 })),
      profit: {
        card: this.getMoney(this.faker.number.int({ max: 100_000 })),
        cash: this.getMoney(this.faker.number.int({ max: 100_000 })),
        merchant: this.getMoney(this.faker.number.int({ max: 100_000 })),
        order: this.getMoney(this.faker.number.int({ max: 100_000 })),
        total: this.getMoney(this.faker.number.int({ max: 100_000 })),
        wallet: this.getMoney(this.faker.number.int({ max: 100_000 })),
      },
      commission: {
        actual: this.getMoney(this.faker.number.int({ max: 10_000 })),
        total: this.getMoney(this.faker.number.int({ max: 10_000 })),
      },
      transfers: {
        from_balance: this.getMoney(this.faker.number.int({ max: 100_000 })),
        replenishment: this.getMoney(this.faker.number.int({ max: 100_000 })),
      },
      split_payments: [],
      grouped_splits: {},
      currency: Currency.UAH,
      online_time_seconds: this.faker.number.int({ max: 100_000 }),
      chain_time_seconds: this.faker.number.int({ max: 100_000 }),
      offer_time_seconds: this.faker.number.int({ max: 100_000 }),
      broadcast_time_seconds: this.faker.number.int({ max: 100_000 }),
      total_time_from_accepted_to_running: this.faker.number.int({ max: 100_000 }),
    };
  }

  private getMoney(amount: number): MoneyDto {
    return {
      amount,
      currency: Currency.UAH,
    };
  }
}
