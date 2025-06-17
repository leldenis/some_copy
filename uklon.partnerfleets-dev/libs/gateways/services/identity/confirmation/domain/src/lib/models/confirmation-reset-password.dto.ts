export interface ConfirmationResetPasswordDto {
  phone_number: string;
  verification_code: string;
  device_id: string;
  new_password: string;
}

export interface CodeVerificationDto {
  phone_number: string;
  verification_code: string;
  device_id: string;
}
