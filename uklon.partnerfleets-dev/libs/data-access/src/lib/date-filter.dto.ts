export interface DateFilterDto extends Record<string, number> {
  date_from: number;
  date_to: number;
}
