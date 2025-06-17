import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { CourierPaths } from '@ui/modules/couriers/models/courier-paths';
import { CouriersPageComponent } from '@ui/modules/couriers/pages/couriers-page/couriers-page.component';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    children: [
      {
        path: CorePaths.EMPTY,
        component: CouriersPageComponent,
      },
      {
        path: `${CourierPaths.DETAILS}/${CourierPaths.COURIER_ID}`,
        loadChildren: async () =>
          import('./features/courier-details/courier-details.module').then((m) => m.CourierDetailsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CouriersModule {}
