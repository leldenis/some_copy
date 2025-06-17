export interface SendPhoneVerificationCodeDto {
  user_contact: string;
  user_agent?: string;
  device_id?: string;
  locale_id?: number;
  client_id?: string;
}
export interface ResetPasswordDto {
  user_contact: string;
  device_id: string;
  user_agent?: string;
  locale?: string;
  calling_component?: string;
  app_hash?: string;
}
