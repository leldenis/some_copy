import { FleetMerchant, IndividualEntrepreneurDto, PaymentProviderDto, WithdrawalType } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentProviderEntity implements PaymentProviderDto {
  @ApiProperty({ type: String })
  public merchant_id: string;

  @ApiProperty({ type: String })
  public merchant_binding_id: string;

  @ApiProperty({ enum: FleetMerchant, enumName: 'FleetMerchant' })
  public type: FleetMerchant;
}

export class IndividualEntrepreneurEntity implements IndividualEntrepreneurDto {
  @ApiPropertyOptional({ type: String })
  public id?: string;

  @ApiPropertyOptional({ type: Boolean })
  public is_selected?: boolean;

  @ApiProperty({ type: String })
  public name: string;

  @ApiProperty({ type: PaymentProviderEntity, isArray: true })
  public payment_providers: PaymentProviderDto[];
}

export class IndividualEntrepreneurCollectionEntity {
  @ApiProperty({ type: IndividualEntrepreneurEntity, isArray: true })
  public items: IndividualEntrepreneurDto[];

  @ApiProperty({ enum: WithdrawalType, enumName: 'WithdrawalType' })
  public withdrawal_type: WithdrawalType;
}
