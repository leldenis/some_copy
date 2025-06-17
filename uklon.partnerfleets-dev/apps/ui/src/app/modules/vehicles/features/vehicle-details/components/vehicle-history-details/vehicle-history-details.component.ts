import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { BlockedListStatusReason, VehicleAccessType } from '@constant';
import { VehicleHistoryChangeItemDto, VehicleHistoryType } from '@data-access';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core';
import { VEHICLE_HISTORY_PROPS_MAP } from '@ui/modules/drivers/consts/history-properties.const';
import { GROW_VERTICAL, NormalizeStringPipe } from '@ui/shared';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { TranslateLoadCapacityPipe } from '@ui/shared/modules/vehicle-shared/pipes/load-capacity/translate-load-capacity.pipe';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { forkJoin, map, Observable, of } from 'rxjs';

@Component({
  selector: 'upf-vehicle-history-details',
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    MatDividerModule,
    TranslateModule,
    LetDirective,
    NormalizeStringPipe,
    TranslateLoadCapacityPipe,
    Seconds2DatePipe,
  ],
  templateUrl: './vehicle-history-details.component.html',
  styleUrls: ['./vehicle-history-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [GROW_VERTICAL()],
})
export class VehicleHistoryDetailsComponent implements OnInit {
  @Input() public info: VehicleHistoryChangeItemDto;

  public readonly historyType = VehicleHistoryType;
  public readonly statusReason = BlockedListStatusReason;
  public readonly vehicleAccessType = VehicleAccessType;
  public readonly vehicleChangeProps: string[] = Object.keys(VEHICLE_HISTORY_PROPS_MAP);
  public readonly vehicleHistoryPropsMap = VEHICLE_HISTORY_PROPS_MAP;
  public productsChanged: Record<string, string[]>;
  public optionsChanged: Record<string, string[]>;
  public driversNames$: Observable<string[]>;

  constructor(private readonly driverService: DriverService) {}

  public ngOnInit(): void {
    this.initProductsChange();
    this.initOptionsChange();
    this.driversNames$ = this.getDriversNames();
  }

  private getDriversNames(): Observable<string[]> {
    const ids = this.info.details['driver_ids'] as string[];

    if (!ids) return of([]);

    const fleetId = this.info.linked_entities['fleet_id'];
    const chunkSize = 50;
    const chunks: string[][] = [];

    for (let i = 0; i < ids.length; i += chunkSize) {
      chunks.push(ids.slice(i, i + chunkSize));
    }

    const requests$ = chunks.map((chunk) => this.driverService.getDriversNames(fleetId, chunk));
    return forkJoin(requests$).pipe(
      map((drivers) => drivers.flat().map(({ first_name, last_name }) => `${last_name} ${first_name}`)),
    );
  }

  private initProductsChange(): void {
    if (this.info.change_type !== VehicleHistoryType.PRODUCT_AVAILABILITY_CHANGED) return;

    this.productsChanged = {
      became_available: this.info.details['became_available'] as string[],
      became_unavailable: this.info.details['became_unavailable'] as string[],
    };
  }

  private initOptionsChange(): void {
    if (this.info.change_type !== VehicleHistoryType.OPTIONS_CHANGED) return;

    this.optionsChanged = {
      removed: this.info.details['removed'] as string[],
      added: this.info.details['added'] as string[],
    };
  }
}
