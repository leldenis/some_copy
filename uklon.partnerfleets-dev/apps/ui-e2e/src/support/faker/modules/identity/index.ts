import { environment } from '@api-env/environment';
import { GrantType } from '@constant';
import { IdentityDto } from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  tokenType: GrantType;
}>;

export class IdentityModule extends ModuleBase<IdentityDto, BuildProps> {
  public buildDto(props?: BuildProps): IdentityDto {
    return {
      access_token: this.faker.string.alphanumeric({ length: 155 }),
      token_type: props?.tokenType ?? 'Bearer',
      refresh_token: this.faker.string.alphanumeric({ length: 108 }),
      client_id: environment.clientId,
      expires_in: this.faker.number.int({ min: 90_000 }),
      expires: this.faker.date.soon({ days: 10 }).toUTCString(),
      issued: this.faker.defaultRefDate().toUTCString(),
    };
  }
}
