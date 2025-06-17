import { IdentityServiceModelErrors } from './identity-service-model-errors';

export interface IdentityServiceErrorDto {
  code: number;
  sub_code: number;
  sub_code_description: string;
  message?: string;
  model_errors?: IdentityServiceModelErrors;
}
