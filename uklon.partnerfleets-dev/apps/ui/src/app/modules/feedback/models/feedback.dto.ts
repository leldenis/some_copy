interface FeedbackFiltersDto {
  period?: { from: number; to: number };
}

interface FeedbackQueryParamsDto {
  limit: number;
  offset: number;
  created_at_from: number;
  created_at_to: number;
}

export interface DriversFeedbackFiltersDto extends FeedbackFiltersDto {
  driverId?: string;
}

export interface DriversFeedbackQueryParamsDto extends FeedbackQueryParamsDto {
  driver_id: string;
}

export interface CouriersFeedbackFiltersDto extends FeedbackFiltersDto {
  courierId?: string;
}

export interface CouriersFeedbackQueryParamsDto extends FeedbackQueryParamsDto {
  courier_id: string;
}
