import { ContactBlockListStatusEntity } from '@api/controllers/contacts/entities/contact-block-list-status.entity';
import { BlockedListStatusDto, FleetContactDto, FleetRole } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class FleetContactEntity implements FleetContactDto {
  @ApiProperty({ enum: FleetRole, enumName: 'FleetRole' })
  public role: FleetRole;

  @ApiProperty({ type: Boolean })
  public mfa_enabled: boolean;

  @ApiProperty({ type: String })
  public user_id: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ type: String })
  public driver_id: string;

  @ApiProperty({ type: ContactBlockListStatusEntity })
  public status: BlockedListStatusDto;
}
