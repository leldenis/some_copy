import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CouriersDeliveriesComponent } from '@ui/modules/couriers-orders/containers/couriers-deliveries/couriers-deliveries.component';
import { CouriersReportsComponent } from '@ui/modules/couriers-orders/containers/couriers-reports/couriers-reports.component';
import { MAT_TAB_IMPORTS, NAMED_FRAGMENTS, NamedFragmentsDirective } from '@ui/shared';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'upf-couriers-orders-container',
  standalone: true,
  imports: [
    MAT_TAB_IMPORTS,
    InfiniteScrollDirective,
    AsyncPipe,
    TranslateModule,
    CouriersDeliveriesComponent,
    CouriersReportsComponent,
  ],
  templateUrl: './couriers-orders-container.component.html',
  styleUrls: ['./couriers-orders-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NAMED_FRAGMENTS,
      useValue: ['couriers-reports', 'deliveries'],
    },
  ],
})
export class CouriersOrdersContainerComponent extends NamedFragmentsDirective {}
