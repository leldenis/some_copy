import { OffsetQueryParamsDto } from '../common';

export interface DriverCommissionProgramsQueryDto extends OffsetQueryParamsDto {
  fleet_id: string;
  region_id: number;
  driver_id?: string;
  from?: number;
  to?: number;
}
