import { SendPhoneVerificationCodeDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class SendPhoneVerificationCodeEntity implements SendPhoneVerificationCodeDto {
  @ApiProperty({ type: String })
  public user_contact: string;

  @ApiProperty({ type: String })
  public user_agent: string;

  @ApiProperty({ type: Number })
  public locale_id: number;

  @ApiProperty({ type: String })
  public client_id: string;

  @ApiProperty({ type: String })
  public device_id: string;
}
