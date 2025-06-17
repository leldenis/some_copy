import { PhotosDto } from '../photos.dto';

export interface FleetOrderRecordEmployeeDto {
  id: string;
  fullName: string;
  photos?: PhotosDto;
}
