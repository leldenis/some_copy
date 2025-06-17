export interface FleetDriverBasicInfoDto {
  driver_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  rating: number;
}
export interface FleetCourierNameByIdDto {
  courier_id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface FleetWithArchivedDriversBasicInfoDto {
  driver_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  rating: number;
  signal?: number;
}
