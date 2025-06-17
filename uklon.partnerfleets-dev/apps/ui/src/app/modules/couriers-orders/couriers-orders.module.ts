import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { CouriersOrdersContainerComponent } from '@ui/modules/couriers-orders/containers/couriers-orders-container/couriers-orders-container.component';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    children: [
      {
        path: CorePaths.EMPTY,
        component: CouriersOrdersContainerComponent,
      },
      {
        path: `${OrdersPaths.DETAILS}/${OrdersPaths.ORDER_ID}`,
        loadComponent: async () =>
          import('./features/delivery-details/containers/delivery-details.component').then(
            ({ DeliveryDetailsComponent }) => DeliveryDetailsComponent,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouriersOrdersModule {}
