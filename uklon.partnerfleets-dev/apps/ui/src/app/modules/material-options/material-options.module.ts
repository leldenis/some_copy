import { NgModule } from '@angular/core';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS } from '@angular/material/autocomplete';
import { MAT_CHECKBOX_DEFAULT_OPTIONS } from '@angular/material/checkbox';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MAT_TABS_CONFIG } from '@angular/material/tabs';

@NgModule({
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        color: 'primary',
        subscriptSizing: 'dynamic',
      },
    },
    {
      provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
      useValue: {
        hideIcon: true,
        color: 'primary',
      },
    },
    {
      provide: MAT_TABS_CONFIG,
      useValue: {
        stretchTabs: false,
      },
    },
    {
      provide: MAT_SELECT_CONFIG,
      useValue: {
        hideSingleSelectionIndicator: true,
      },
    },
    {
      provide: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,
      useValue: {
        hideSingleSelectionIndicator: true,
      },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 10_000,
      },
    },
    {
      provide: MAT_CHECKBOX_DEFAULT_OPTIONS,
      useValue: {
        color: 'primary',
      },
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        maxWidth: '90vw',
        width: '560px',
      },
    },
  ],
})
export class MaterialOptionsModule {}
