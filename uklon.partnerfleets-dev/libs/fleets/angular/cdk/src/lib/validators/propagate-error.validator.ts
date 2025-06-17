import { AbstractControl, FormArray, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { FormType } from '../types';

export function propagateErrorValidator<T extends FormType>(
  childKey: keyof T,
  ...validators: ValidatorFn[]
): ValidatorFn {
  return (control: AbstractControl) => {
    if (control instanceof FormGroup || control instanceof FormArray) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const child = control.get([childKey as string]) as AbstractControl;
      const validator = Validators.compose(validators);
      child?.setErrors(validator(child));
    }
    return null;
  };
}
