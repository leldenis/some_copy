import { Pipe, PipeTransform } from '@angular/core';
import { TicketStatus } from '@constant';

@Pipe({
  name: 'showDeadline',
  standalone: true,
})
export class ShowDeadlinePipe implements PipeTransform {
  public transform(status: TicketStatus, deadline: number): boolean {
    return status === TicketStatus.DRAFT && deadline > 0;
  }
}
