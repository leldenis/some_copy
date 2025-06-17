import { IdentityDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class IdentityEntity implements IdentityDto {
  @ApiProperty({ type: String })
  public access_token: string;

  @ApiProperty({ type: String })
  public token_type: string;

  @ApiProperty({ type: String })
  public refresh_token: string;

  @ApiProperty({ type: String })
  public client_id: string;

  @ApiProperty({ type: Number })
  public expires_in: number;

  @ApiProperty({ type: String })
  public expires: string;

  @ApiProperty({ type: String })
  public issued: string;
}
