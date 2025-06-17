export interface ProductAvailabilityDto {
  is_available: boolean;
  is_restricted_by_accessibility_rules: boolean;
  is_blocked: boolean;
  is_restricted_by_selected_vehicle: boolean;
  is_restricted_by_vehicle_params: boolean;
}
