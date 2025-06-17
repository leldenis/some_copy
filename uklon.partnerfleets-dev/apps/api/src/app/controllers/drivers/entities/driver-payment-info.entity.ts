import { DriverPaymentAccountType, DriverPaymentInfoDto } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverPaymentInfoEntity implements DriverPaymentInfoDto {
  @ApiProperty({ enum: DriverPaymentAccountType, enumName: 'DriverPaymentAccountType' })
  public account_type: DriverPaymentAccountType;

  @ApiProperty({ type: String })
  public address: string;

  @ApiProperty({ type: String })
  public account_owner: string;

  @ApiProperty({ type: String })
  public account_number: string;

  @ApiProperty({ type: String })
  public bank_name_or_swift_code: string;

  @ApiPropertyOptional({ type: String })
  public company_name?: string;

  @ApiPropertyOptional({ type: String })
  public registration_number?: string;

  @ApiPropertyOptional({ type: String })
  public vat_payer_number?: string;
}
