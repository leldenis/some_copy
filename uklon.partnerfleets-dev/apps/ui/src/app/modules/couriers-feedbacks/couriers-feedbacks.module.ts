import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { IconsModule } from '@ui/core/icons.module';
import { CouriersAutocompleteComponent, DateTimeRangeControlComponent } from '@ui/shared';
import { EmptyStateComponent } from '@ui/shared/components/empty-state/empty-state.component';
import { FiltersContainerComponent } from '@ui/shared/components/filters-container/filters-container.component';
import { LetDirective } from '@ui/shared/directives/let.directive';
import { Seconds2DatePipe } from '@ui/shared/pipes/seconds-2-date/seconds-2-date.pipe';
import { Seconds2TimePipe } from '@ui/shared/pipes/seconds-2-time/seconds-2-time.pipe';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxTippyModule } from 'ngx-tippy-wrapper';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Material
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatExpansionModule,
    // Utils
    IconsModule,
    NgxTippyModule,
    TranslateModule,
    InfiniteScrollModule,
    // Components
    FiltersContainerComponent,
    LetDirective,
    CouriersAutocompleteComponent,
    EmptyStateComponent,
    Seconds2DatePipe,
    Seconds2TimePipe,
    DateTimeRangeControlComponent,
  ],
})
export class CouriersFeedbacksModule {}
