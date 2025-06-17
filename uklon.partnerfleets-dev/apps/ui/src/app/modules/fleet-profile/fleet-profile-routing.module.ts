import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorePaths } from '@ui/core/models/core-paths';
import { FleetProfileContainerComponent } from '@ui/modules/fleet-profile/containers/fleet-profile-container/fleet-profile-container.component';

const routes: Routes = [
  {
    path: CorePaths.EMPTY,
    component: FleetProfileContainerComponent,
  },
  { path: CorePaths.UNKNOWN, redirectTo: CorePaths.EMPTY },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FleetProfileRoutingModule {}
