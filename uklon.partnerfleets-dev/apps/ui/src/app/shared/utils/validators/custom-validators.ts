import { AbstractControl, ValidatorFn } from '@angular/forms';

import { transliterate } from '../licence-plate-translitration';

export const LICENCE_PLATE_REG_EXP = /^[\dA-Za-z]+$/;
export const LOWER_CASE_REG_EXP = /[a-zа-я]/;
export const UPPER_CASE_REG_EXP = /[A-ZА-Я]/;
export const DIGITS_REG_EXP = /\d/;
export const MASTERCARD_OR_VISA = /5[1-5]\d{14}|4\d{15}/;

export type PasswordValidatorError = 'minMaxLength' | 'lowerCase' | 'upperCase' | 'digits';

// eslint-disable-next-line unicorn/no-static-only-class
export class CustomValidators {
  /**
   * @description
   * Validator that requires the control's value to contain any lower case character.
   */
  public static lowerCase(): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = LOWER_CASE_REG_EXP.test(control.value);
      return valid ? null : { lowerCase: true };
    };
  }

  /**
   * @description
   * Validator that requires the control's value to contain any upper case character.
   */
  public static upperCase(): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = UPPER_CASE_REG_EXP.test(control.value);
      return valid ? null : { upperCase: true };
    };
  }

  /**
   * @description
   * Validator that requires the control's value to contain any digit.
   */
  public static digits(): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = DIGITS_REG_EXP.test(control.value);
      return valid ? null : { digits: true };
    };
  }

  /**
   * @description
   * Validator that requires the control's value be from MIN to MAX characters long.
   * @param min  @param max
   */
  public static minMaxLength(min: number = 8, max: number = 36): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = control.value.length >= min && control.value.length <= max;
      return valid ? null : { minMaxLength: true };
    };
  }

  /**
   * @description
   * Validator that requires the control's value to match another control's value from the same formGroup.
   * @param controlName @param errorName
   */
  public static match(controlName: string, errorName = 'passwordMismatch'): ValidatorFn {
    return (control: AbstractControl) => {
      const matchedValue = control?.parent?.get(controlName)?.value;
      const valid = matchedValue === control.value;
      return valid ? null : { [errorName]: true };
    };
  }

  public static licensePlate(): ValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) return null;

      const valid = LICENCE_PLATE_REG_EXP.test(transliterate(control.value));
      return valid ? null : { invalidLicensePlate: true };
    };
  }

  public static cardExpiration(yearControl = 'expiration_year', monthControl = 'expiration_month'): ValidatorFn {
    return (control: AbstractControl) => {
      const year = control.get(yearControl);
      const month = control.get(monthControl);

      if (year.invalid || month.invalid) return null;

      const expirationDate: Date = new Date(+`20${year.value}`, month.value, 0);
      const diff = Date.now() - expirationDate.getTime();

      return diff < 0 ? null : { expError: true };
    };
  }

  /**
   * @description
   * Validator that requires the control's value to contain mastercard or visa number.
   */
  public static mastercardOrVisa(): ValidatorFn {
    return (control: AbstractControl) => {
      const valid = MASTERCARD_OR_VISA.test(control.value);
      return valid ? null : { mastercardOrVisa: true };
    };
  }
}
