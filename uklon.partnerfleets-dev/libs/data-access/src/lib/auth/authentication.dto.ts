import { GrantType } from '@constant';

export interface AuthenticationDto {
  contact?: string;
  password?: string;
  grant_type: GrantType;
  refresh_token?: string;
  client_id: string;
  client_secret: string;
  device_id?: string;
}

export interface AuthConfirmationDto {
  user_contact: string;
  user_agent?: string;
  device_id: string;
  locale?: string;
  client_id?: string;
  calling_component?: string;
  app_hash?: string;
  country_code?: string;
  city_id?: number;
}

export interface AuthConfirmationMethodDto {
  method: AuthMethod;
  priority: number;
}

export enum AuthMethod {
  SMS = 'sms',
  PASSWORD = 'password',
}
