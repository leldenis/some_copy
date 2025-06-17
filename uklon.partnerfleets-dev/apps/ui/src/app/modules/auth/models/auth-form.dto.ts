import { FormControl } from '@angular/forms';

export interface AuthFormDto {
  contact: string;
  password: string;
  isRememberMe: boolean;
}

export interface LoginFormGroupDto {
  contact: FormControl<string>;
  password: FormControl<string>;
  isRememberMe: FormControl<boolean>;
}
