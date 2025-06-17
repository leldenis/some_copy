import {
  FleetMerchant,
  SplitPaymentDto,
  StatisticDetailsDto,
  StatisticLossDto,
  StatisticProfitDto,
} from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

export type BuildProps = Partial<{
  completed_orders?: number;
  total_distance_meters?: number;
  profit?: StatisticProfitDto;
  split_payments: SplitPaymentDto[];
  loss?: StatisticLossDto;
}>;

export class FleetDriverStatisticModule extends ModuleBase<StatisticDetailsDto, BuildProps> {
  public buildDto(props?: BuildProps): StatisticDetailsDto {
    return {
      cancellation_percentage: 0,
      completed_orders: props?.completed_orders ?? 0,
      grouped_splits: {
        entrepreneur_123: [
          {
            split_payment_id: 'sp_001',
            payment_provider: FleetMerchant.FONDY,
            merchant_id: 'merchant_001',
            total: { amount: 10_000, currency: Currency.UAH },
            fee: { amount: 500, currency: Currency.UAH },
          },
          {
            split_payment_id: 'sp_002',
            payment_provider: FleetMerchant.IPAY,
            merchant_id: 'merchant_002',
            total: { amount: 20_000, currency: Currency.UAH },
            fee: { amount: 1000, currency: Currency.UAH },
          },
        ],
      },
      earnings_for_period: {
        amount: 9500,
        currency: Currency.UAH,
      },
      loss: props?.loss ?? {
        order: {},
      },
      profit: props?.profit ?? {
        order: {
          total: {
            amount: 9500,
            currency: Currency.UAH,
          },
        },
      },
      split_payments: props?.split_payments ?? [],
      total_distance_meters: props?.total_distance_meters ?? 11_000,
      total_executing_time: 0,
    };
  }
}
