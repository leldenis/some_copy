import { AbstractControl, ValidatorFn } from '@angular/forms';

const valueForDivideCheckSum = 11;
const lastNumberCheckSum = 10;
const lastITNIndex = 9;

export function itnNumberValidator(): ValidatorFn {
  /**
   * Example: ABCDEFGHIJ
   * sum = A * (- 1) + B * 5 + C * 7 + D * 9 + E * 4 + F * 6 + G * 10 + H * 5 + I * 7
   * checkSum = sum - (11 * whole part of (sum / 11))
   * valid checkSum from 0 to 9
   * */
  return (control: AbstractControl) => {
    if (typeof control.value === 'string') {
      const values = control.value;
      const coefficients = [-1, 5, 7, 9, 4, 6, 10, 5, 7];

      let sum = 0;

      for (let i = 0; i < values.length - 1; i += 1) {
        sum += Number(values[i]) * coefficients[i];
      }

      const checkSum = (sum % valueForDivideCheckSum) % lastNumberCheckSum;

      if (checkSum !== Number(values[lastITNIndex])) {
        return {
          itnError: true,
        };
      }
    }

    return null;
  };
}
