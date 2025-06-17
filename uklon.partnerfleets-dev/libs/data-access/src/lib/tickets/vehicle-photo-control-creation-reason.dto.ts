import { VehiclePhotoControlCreatingReason } from '@constant';

export interface VehiclePhotoControlCreatingReasonsDto {
  reasons?: VehiclePhotoControlCreatingReason[];
  reason_comment?: string;
}
