import { FleetSignatureKeyIdDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetSignatureKeyIdEntity implements FleetSignatureKeyIdDto {
  @ApiProperty({ type: String })
  public key_id: string;
}
