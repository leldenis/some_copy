import {
  FleetBalanceSplitModelDto,
  FleetBalancesSplitDistributionModel,
  FleetWalletBalanceSplitModel,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetBalanceSplitModelEntity implements FleetBalanceSplitModelDto {
  @ApiProperty({ enum: FleetWalletBalanceSplitModel, enumName: 'FleetWalletBalanceSplitModel' })
  public split_adjustment_model: FleetWalletBalanceSplitModel;

  @ApiProperty({ enum: FleetBalancesSplitDistributionModel, enumName: 'FleetBalancesSplitDistributionModel' })
  public split_distribution_model: FleetBalancesSplitDistributionModel;
}
