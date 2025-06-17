import { TicketStatus } from '@constant';

import { CursorQueryDto, DateRangeQuery } from '../common';

export interface VehicleBrandingPeriodTicketQueryParamsDto extends CursorQueryDto, DateRangeQuery {
  status?: TicketStatus[];
  license_plate?: string;
}
