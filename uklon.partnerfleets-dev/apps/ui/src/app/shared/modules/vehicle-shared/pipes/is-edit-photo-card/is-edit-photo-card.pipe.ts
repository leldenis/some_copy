import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus, VehiclePhotosCategory } from '@constant';
import { VehicleTicketImages } from '@data-access';

@Pipe({
  name: 'isEditPhotoCard',
  standalone: true,
})
export class IsEditPhotoCardPipe implements PipeTransform {
  public transform(
    isEdit: boolean,
    ticketStatus: TicketStatus,
    category: VehiclePhotosCategory,
    uploadedImages: VehicleTicketImages,
  ): boolean {
    if (ticketStatus !== TicketStatus.CLARIFICATION) {
      return isEdit;
    }

    const photoKeys = Object.keys(uploadedImages) || [];
    return ticketStatus === TicketStatus.CLARIFICATION && isEdit && !photoKeys.includes(category);
  }
}
