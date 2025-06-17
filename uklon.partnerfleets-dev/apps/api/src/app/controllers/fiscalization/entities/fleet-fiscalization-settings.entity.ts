import {
  FiscalizationFarePaymentType,
  FiscalizationVatType,
  FleetFiscalizationSettingsDto,
  FleetFiscalizationStatusDto,
} from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FleetFiscalizationSettingsEntity implements FleetFiscalizationSettingsDto {
  @ApiProperty({ enum: FiscalizationVatType, enumName: 'FiscalizationVatType' })
  public vat_type: FiscalizationVatType;

  @ApiProperty({ enum: FiscalizationFarePaymentType, enumName: 'FiscalizationFarePaymentType', isArray: true })
  public fare_payment_types: FiscalizationFarePaymentType[];

  @ApiPropertyOptional({ type: String })
  public service_product_name?: string;
}

export class FleetFiscalizationStatusEntity implements FleetFiscalizationStatusDto {
  @ApiProperty({ type: Boolean })
  public status: boolean;
}
