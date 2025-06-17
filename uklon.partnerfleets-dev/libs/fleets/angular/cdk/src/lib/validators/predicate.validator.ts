import { AbstractControl, ValidatorFn } from '@angular/forms';

type PredicateValidatorFn = (control: AbstractControl) => boolean;

export const predicateValidator = (predicate: PredicateValidatorFn, validator: ValidatorFn): ValidatorFn => {
  return (control: AbstractControl) => {
    return predicate(control) ? validator(control) : null;
  };
};
