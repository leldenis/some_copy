import { TicketStatus, TicketType } from '@constant';
import { PaginationCollectionDto, VehicleTicketDto } from '@data-access';
import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';

const mockData: PaginationCollectionDto<VehicleTicketDto> = {
  total_count: 1,
  items: [
    {
      model_id: '0ac91768-b4cf-43d2-a81f-9b93640f68d4',
      model: 'BMW',
      make_id: '7e1486a9-d295-43f7-83a5-d896d92f816b',
      make: '645',
      production_year: 1999,
      license_plate: 'AA1111DD',
      id: '8jd62hd8-4ld8-92jd-9281-d896d92f816b',
      type: TicketType.VEHICLE_TO_FLEET_ADDITION,
      status: TicketStatus.DRAFT,
      created_at: 1_636_377_803,
    },
  ],
};

@Injectable()
export class TicketsMockService {
  public getVehicleTickets(): Observable<PaginationCollectionDto<VehicleTicketDto>> {
    return of(mockData);
  }
}
