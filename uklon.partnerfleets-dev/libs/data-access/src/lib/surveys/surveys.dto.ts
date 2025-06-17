/* eslint-disable @typescript-eslint/naming-convention */
export enum SurveyMark {
  'one' = 1,
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
}

export interface ActiveSurveyDto {
  id: string;
  required_at: number;
}

export interface SurveyResponseDto {
  mark: SurveyMark;
  comment: string;
}
