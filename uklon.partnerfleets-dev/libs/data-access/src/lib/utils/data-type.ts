import { Currency as UklCurrency } from '@uklon/types';

export type UID = string;
export type Email = string;
export type Money = number;
export type Timestamp = number;
export type Currency = UklCurrency | string;

export interface CursorPageRequestDto {
  limit: number;
  cursor?: string;
}

export interface InfinityPageRequestDto {
  limit: number;
  offset: number;
}
