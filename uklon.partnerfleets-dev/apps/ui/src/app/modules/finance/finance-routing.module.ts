import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { FinanceTabsComponent } from '@ui/modules/finance/components/finance-tabs/finance-tabs.component';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    children: [
      {
        path: CorePaths.EMPTY,
        component: FinanceTabsComponent,
      },
    ],
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceRoutingModule {}
