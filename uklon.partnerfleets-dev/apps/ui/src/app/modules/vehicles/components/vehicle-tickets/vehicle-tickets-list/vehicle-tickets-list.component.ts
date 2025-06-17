import { SelectionModel } from '@angular/cdk/collections';
import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TicketStatus } from '@constant';
import { VehicleTicketDto } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { VehiclePaths } from '@ui/modules/vehicles/models/vehicle-paths';
import { MAT_TABLE_IMPORTS, StatusBadgeComponent } from '@ui/shared';
import { PaginationComponent } from '@ui/shared/components/pagination';
import { VEHICLE_TICKET_STATUS_COLOR } from '@ui/shared/consts';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';

@Component({
  selector: 'upf-vehicle-tickets-list',
  standalone: true,
  imports: [
    MAT_TABLE_IMPORTS,
    TranslateModule,
    RouterLink,
    MatIcon,
    MatIconButton,
    MatMenuTrigger,
    MatMenuContent,
    MatMenu,
    MatMenuItem,
    Seconds2DatePipe,
    StatusBadgeComponent,
    NgClass,
    PaginationComponent,
  ],
  templateUrl: './vehicle-tickets-list.component.html',
  styleUrls: ['./vehicle-tickets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleTicketsListComponent {
  @Input() public ticketsList: VehicleTicketDto[];
  @Input() public vehiclesTicketsListTotalCount: number;

  @Output() public loadNext = new EventEmitter<undefined>();
  @Output() public deleteTicket = new EventEmitter<string>();

  public readonly selection = new SelectionModel<number>();
  public readonly vehiclePath = VehiclePaths;
  public readonly ticketStatusRef = TicketStatus;
  public readonly statusColorMap = VEHICLE_TICKET_STATUS_COLOR;
  public columnsToDisplay = ['LicensePlate', 'Date', 'Status', 'Deletion'];

  public onLoadNext(): void {
    this.loadNext.emit();
  }

  public onDeleteTicketClick(event: Event, ticketId: string): void {
    event.stopPropagation();
    this.deleteTicket.emit(ticketId);
  }

  public toggle(value: number): void {
    this.selection.toggle(value);
  }
}
