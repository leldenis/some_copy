import { CursorQueryDto, DateRangeDto } from '../common';

export interface VehicleOrderReportQueryDto extends Partial<DateRangeDto>, CursorQueryDto {
  vehicle_id?: string;
}
