import { UID } from '../utils';

export enum UklonGarageApplicationStatus {
  NEW = 'New',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED_BY_PARALLEL_REGISTRATION = 'ClosedByParallelRegistration',
  REVIEW = 'Review',
}

export interface UklonGarageApplicationDto {
  first_name: string;
  last_name: string;
  phone: string;
  comment: string;
}

export interface UklonGarageFleetApplicationDto extends UklonGarageApplicationDto {
  id: UID;
  status: UklonGarageApplicationStatus;
  created_at: number;
}
