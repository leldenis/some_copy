export interface ReportByOrdersQueryDto {
  date_from: number;
  date_to: number;
  driver_id?: string;
  vehicle_id?: string;
  limit: number;
  offset: number;
}

export interface CourierReportsQueryDto {
  from: number;
  to: number;
  courier_id: string;
  limit: number;
  offset: number;
}
