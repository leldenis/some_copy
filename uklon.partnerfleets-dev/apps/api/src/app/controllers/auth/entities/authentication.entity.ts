import { GrantType } from '@constant';
import { AuthConfirmationDto, AuthConfirmationMethodDto, AuthenticationDto, AuthMethod } from '@data-access';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthenticationEntity implements AuthenticationDto {
  @ApiPropertyOptional({ type: String })
  public contact?: string;

  @ApiPropertyOptional({ type: String })
  public password?: string;

  @ApiProperty({ enum: GrantType, enumName: 'GrantType' })
  public grant_type: GrantType;

  @ApiPropertyOptional({ type: String })
  public refresh_token?: string;

  @ApiProperty({ type: String })
  public client_id: string;

  @ApiProperty({ type: String })
  public client_secret: string;

  @ApiPropertyOptional({ type: String })
  public device_id?: string;
}

export class AuthConfirmationEntity implements AuthConfirmationDto {
  @ApiProperty({ type: String })
  public user_contact: string;

  @ApiPropertyOptional({ type: String })
  public user_agent?: string;

  @ApiProperty({ type: String })
  public device_id: string;

  @ApiPropertyOptional({ type: String })
  public locale?: string;

  @ApiPropertyOptional({ type: String })
  public client_id?: string;

  @ApiPropertyOptional({ type: String })
  public calling_component?: string;

  @ApiPropertyOptional({ type: String })
  public app_hash?: string;

  @ApiPropertyOptional({ type: String })
  public country_code?: string;

  @ApiPropertyOptional({ type: Number })
  public city_id?: number;
}

export class AuthConfirmationMethodEntity implements AuthConfirmationMethodDto {
  @ApiProperty({ enum: AuthMethod, enumName: 'AuthMethod' })
  public method: AuthMethod;

  @ApiProperty({ type: Number })
  public priority: number;
}
