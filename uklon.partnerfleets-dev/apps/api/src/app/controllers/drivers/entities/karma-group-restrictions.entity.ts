import { KarmaGroupDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class KarmaGroupRestrictionsEntity implements KarmaGroupDto<string[]> {
  @ApiProperty({ type: String, isArray: true })
  public first_priority: string[];

  @ApiProperty({ type: String, isArray: true })
  public offers_and_broadcast_blocked: string[];

  @ApiProperty({ type: String, isArray: true })
  public offers_blocked: string[];

  @ApiProperty({ type: String, isArray: true })
  public second_priority: string[];
}
