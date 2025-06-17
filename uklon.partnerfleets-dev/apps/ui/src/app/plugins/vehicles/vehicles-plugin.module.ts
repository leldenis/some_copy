/* eslint-disable @typescript-eslint/promise-function-async */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DriverService } from '@ui/core/services/datasource/driver.service';
import { DeviceService } from '@ui/core/services/device.service';
import { IsCargoRequiredPipe } from '@ui/modules/vehicles/features/vehicle-creation/pipes/is-cargo-required/is-cargo-required.pipe';
import { PhotoControlDeadlineMessagePipe } from '@ui/modules/vehicles/pipes/photo-control-deadline-message/photo-control-deadline-message.pipe';
import { TicketsService } from '@ui/modules/vehicles/services/tickets.service';
import { VehiclesService } from '@ui/modules/vehicles/services/vehicles.service';
import { VehiclesEffects } from '@ui/modules/vehicles/store/vehicles/vehicles.effects';
import { vehiclesReducer } from '@ui/modules/vehicles/store/vehicles/vehicles.reducer';
import { UnsupportedPageComponent } from '@ui/plugins/vehicles/components/unsupported-page/unsupported-page.component';
import { VehicleCreateResolver } from '@ui/plugins/vehicles/resolvers/vehicle-create.resolver';
import { VehicleTicketResolver } from '@ui/plugins/vehicles/resolvers/vehicle-ticket.resolver';
import {
  DotMarkerIconComponent,
  LanguageSelectComponent,
  PhotoCardNewComponent,
  StatusBadgeComponent,
  TicketStatusReasonsComponent,
} from '@ui/shared';
import { FooterComponent } from '@ui/shared/components/footer/footer.component';
import { ProgressStepperComponent } from '@ui/shared/components/progress-stepper/progress-stepper.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { PhotoCategoriesPipe } from '@ui/shared/modules/vehicle-shared/pipes/photo-categories/photo-categories.pipe';

import { VehiclePhotoControlFormResolver } from './resolvers/vehicle-photo-control-form.resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create',
        component: UnsupportedPageComponent,
        resolve: {
          data: VehicleCreateResolver,
        },
      },
      {
        path: 'ticket',
        component: UnsupportedPageComponent,
        resolve: {
          data: VehicleTicketResolver,
        },
      },
      {
        path: 'photo-control',
        component: UnsupportedPageComponent,
        resolve: {
          data: VehiclePhotoControlFormResolver,
        },
      },
      {
        path: 'photo-control/success',
        component: UnsupportedPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild(routes),

    TranslateModule,
    MatIconModule,

    StoreModule.forFeature('vehicles', vehiclesReducer),
    EffectsModule.forFeature([VehiclesEffects]),

    MatButtonModule,
    FooterComponent,
    MatDividerModule,
    MatExpansionModule,
    ProgressStepperComponent,
    LanguageSelectComponent,
    StatusBadgeComponent,
    PhotoControlDeadlineMessagePipe,
    LetDirective,
    DotMarkerIconComponent,
    PhotoCategoriesPipe,
    IsCargoRequiredPipe,
    TicketStatusReasonsComponent,
    ReactiveFormsModule,
    PhotoCardNewComponent,
  ],
  providers: [
    VehicleCreateResolver,
    VehicleTicketResolver,
    VehiclePhotoControlFormResolver,
    VehiclesService,
    TicketsService,
    DriverService,
    DeviceService,
  ],
})
export class VehiclesPluginModule {}
