export interface PasswordValidityEventDto {
  control: 'newPassword' | 'confirmPassword';
  valid: boolean;
}
