export interface PasswordRecoveryConfirmationDto {
  code: string;
  phoneNumber: string;
  deviceId: string;
  password: string;
}
