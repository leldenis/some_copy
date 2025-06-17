import { BlockedListStatusEntity } from '@api/controllers/account/entities/blocked-list-status.entity';
import { FleetEntity } from '@api/controllers/account/entities/fleet.entitiy';
import { AccountDto, BlockedListStatusDto, FleetDto, Locale } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AccountEntity implements AccountDto {
  @ApiProperty({ type: String })
  public user_id: string;

  @ApiProperty({ type: String })
  public last_name: string;

  @ApiProperty({ type: String })
  public first_name: string;

  @ApiProperty({ type: String })
  public phone: string;

  @ApiProperty({ type: String })
  public email: string;

  @ApiProperty({ enum: Locale, enumName: 'Locale' })
  public locale: Locale;

  @ApiProperty({ type: FleetEntity, isArray: true })
  public fleets: FleetDto[];

  @ApiProperty({ type: Boolean })
  public mfa_enabled: boolean;

  @ApiPropertyOptional({ type: BlockedListStatusEntity })
  public status?: BlockedListStatusDto;
}
