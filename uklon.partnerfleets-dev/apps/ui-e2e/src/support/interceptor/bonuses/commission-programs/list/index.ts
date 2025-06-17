import { CommissionProgramType } from '@constant';

import { fleetFaker } from '../../../../faker';
import { BuildProps } from '../../../../faker/modules/bonuses/commission-programs/list';
import { BaseInterceptor, InterceptorReturnType } from '../../../_internal';

export class CommissionProgramsListIntercept extends BaseInterceptor<BuildProps> {
  constructor(
    public entity: 'drivers' | 'vehicles',
    public programType: CommissionProgramType,
  ) {
    super(`/api/bonuses/${entity}/commission-programs/${programType}?fleet_id=*`, 'GET');
  }

  protected ok(props?: BuildProps): InterceptorReturnType {
    return this.intercept({
      statusCode: 200,
      body: fleetFaker.commissionsProgramsList.buildDto(props),
    });
  }

  protected bad(): InterceptorReturnType {
    return this.intercept({
      statusCode: 400,
    });
  }
}
