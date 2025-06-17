import { OffsetQueryParamsDto } from '../common';

export interface VehiclesCommissionProgramsQueryDto extends OffsetQueryParamsDto {
  fleet_id: string;
  vehicle_id?: string;
  region_id: number;
  from?: number;
  to?: number;
}
