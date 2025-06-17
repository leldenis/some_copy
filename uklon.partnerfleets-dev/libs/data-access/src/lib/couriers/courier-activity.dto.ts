export interface CourierActivityRateDto {
  value: number;
}

export interface CourierActivityCalcByOrdersDto {
  completed_count: number;
  rejected_count: number;
  canceled_count: number;
}

export interface CourierActivityRateDetailsDto extends CourierActivityRateDto {
  calculated_by_orders: CourierActivityCalcByOrdersDto;
}

export interface CourierActivitySettingsDto {
  is_active: boolean;
  activated_at: number;
}
