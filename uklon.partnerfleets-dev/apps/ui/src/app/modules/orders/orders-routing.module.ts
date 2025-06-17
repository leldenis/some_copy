import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { OrdersTabsComponent } from '@ui/modules/orders/containers/orders-tabs/orders-tabs.component';
import { OrdersPaths } from '@ui/modules/orders/models/orders-paths';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    children: [
      {
        path: CorePaths.EMPTY,
        component: OrdersTabsComponent,
      },
      {
        path: `${OrdersPaths.DETAILS}/${OrdersPaths.ORDER_ID}`,
        loadComponent: async () =>
          import('./features/order-details/containers/order-details.component').then(
            ({ OrderDetailsComponent }) => OrderDetailsComponent,
          ),
      },
    ],
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
