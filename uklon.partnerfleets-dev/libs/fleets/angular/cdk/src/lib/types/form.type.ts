import { AbstractControl } from '@angular/forms';

export type FormType<T = Record<string, unknown>> = {
  [Property in keyof T]: AbstractControl<T[Property]>;
};
