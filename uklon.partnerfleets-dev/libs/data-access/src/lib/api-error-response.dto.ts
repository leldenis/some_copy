export interface ApiErrorResponseDto {
  error_code: string;
  message: string;
  error?: ApiErrorWithSubCodeResponseDto;
}

export interface ApiErrorWithSubCodeResponseDto {
  code: number;
  sub_code: number;
  sub_code_description: string;
  message?: string;
  model_errors?: Record<string, string[]>;
}
