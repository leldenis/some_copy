import { InfinityScrollCollectionDto } from '../pagination/ininity-scroll-collection.dto';

export enum FleetWalletBalanceSplitModel {
  TIME_RANGE_SPLIT_ADJUSTMENT = 'TimeRangeSplitAdjustment',
  PER_SPLIT_ADJUSTMENT = 'PerSplitAdjustment',
}

export enum FleetBalancesSplitDistributionModel {
  IGNORE_WALLET_BALANCE_DISTRIBUTION_SPLIT = 'IgnoreWalletBalanceDistributionSplit',
  FOCUSED_ON_WALLET_BALANCE_DISTRIBUTION_SPLIT = 'FocusedOnWalletBalanceDistributionSplit',
}

export interface FleetBalanceSplitDto {
  fleet_id: string;
  created_at: number;
  initiated_by_user_id?: string;
}

export interface FleetBalanceSplitAdjustmentDto extends FleetBalanceSplitDto {
  id: string;
  split_adjustment_model: FleetWalletBalanceSplitModel;
  activation_date: number;
}

export type FleetBalanceSplitAdjustmentModelCollection = InfinityScrollCollectionDto<FleetBalanceSplitAdjustmentDto>;

export interface FleetBalanceSplitDistributionModelDto extends FleetBalanceSplitDto {
  split_distribution_model: FleetBalancesSplitDistributionModel;
  updated_at: number;
}

export interface FleetBalanceSplitModelDto {
  split_adjustment_model: FleetWalletBalanceSplitModel;
  split_distribution_model: FleetBalancesSplitDistributionModel;
}
