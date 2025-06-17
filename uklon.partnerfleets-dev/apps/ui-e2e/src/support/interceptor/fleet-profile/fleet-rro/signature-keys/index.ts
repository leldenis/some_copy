import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/fleet-profile/fleet-rro/signature-keys';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class FleetSignatureKeysIntercept extends BaseInterceptor<BuildProps> {
  constructor(fleetId: string) {
    super(`api/fiscalization/${fleetId}/signature-keys`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.signatureKeys.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
