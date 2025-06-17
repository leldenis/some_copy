import { AuthConfirmationMethodDto, AuthMethod } from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<AuthConfirmationMethodDto>;

export class AuthConfirmationMethodModule extends ModuleBase<AuthConfirmationMethodDto, BuildProps> {
  public buildDto(props?: BuildProps): AuthConfirmationMethodDto {
    return {
      method: props?.method ?? AuthMethod.PASSWORD,
      priority: props?.priority ?? 0,
    };
  }
}
