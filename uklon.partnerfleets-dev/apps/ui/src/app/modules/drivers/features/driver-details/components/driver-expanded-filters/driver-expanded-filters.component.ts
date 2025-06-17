import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  ValidationErrors,
  UntypedFormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import {
  DriverProductConfigurationsDto,
  DriverRideConditionDto,
  DriverSelectedVehicleDto,
  FleetDto,
  SetDriverProductConfigurationDto,
} from '@data-access';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DriverRideConditionsComponent } from '@ui/modules/drivers/features/driver-details/components/driver-ride-conditions/driver-ride-conditions.component';
import { ProductConfigurationComponent } from '@ui/modules/drivers/features/driver-details/components/product-configuration/product-configuration.component';
import { driversActions } from '@ui/modules/drivers/store/drivers/drivers.actions';
import { DriversEffects } from '@ui/modules/drivers/store/drivers/drivers.effects';
import { DriversState } from '@ui/modules/drivers/store/drivers/drivers.reducer';
import * as driversSelectors from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { driverRideConditions } from '@ui/modules/drivers/store/drivers/drivers.selectors';
import { NormalizeStringPipe, StatusBadgeComponent, UIService } from '@ui/shared';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

interface DriverProductConfigurationsViewModel extends DriverProductConfigurationsDto {
  disabled?: boolean;
}

@Component({
  selector: 'upf-driver-expanded-filters',
  standalone: true,
  imports: [
    TranslateModule,
    NgClass,
    AsyncPipe,
    ReactiveFormsModule,
    MatSlideToggle,
    NormalizeStringPipe,
    StatusBadgeComponent,
    MatIcon,
    DriverRideConditionsComponent,
    MatButton,
    TitleCasePipe,
  ],
  templateUrl: './driver-expanded-filters.component.html',
  styleUrls: ['./driver-expanded-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriverExpandedFiltersComponent implements OnInit, OnDestroy {
  @Input() public selectedFleet: FleetDto;
  @Input() public selectedVehicle: DriverSelectedVehicleDto;
  @Input() public isDriverBlocked: boolean;

  public driverRideCondition$: Observable<DriverRideConditionDto[]> = this.driversStore.select(driverRideConditions);
  public getFleetDriversProductsConfigurations$ = this.driversStore
    .select(driversSelectors.getFleetDriverProductsConfigurations)
    .pipe(
      tap((products: DriverProductConfigurationsDto[]) => {
        if (products) {
          this.productsList = products;
          this.setProducts(products);
          this.filterList(this.displayActiveProducts);
        }
      }),
    );
  public driverId: string;
  public productsFormArray: UntypedFormArray;
  public productsList: DriverProductConfigurationsDto[] = [];
  public productsListFiltered: DriverProductConfigurationsViewModel[] = [];
  public activeProductId: string;
  public displayActiveProducts = true;

  public configurationChanges = new Map<string, SetDriverProductConfigurationDto>();

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly driversStore: Store<DriversState>,
    private readonly vcr: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly driversEffects: DriversEffects,
    private readonly uiService: UIService,
  ) {}

  public ngOnInit(): void {
    this.driverId = this.route.snapshot.paramMap.get('driverId');
    this.driversStore.dispatch(
      driversActions.getFleetDriverProductsConfigurations({
        fleetId: this.selectedFleet.id,
        driverId: this.driverId,
      }),
    );

    this.driversEffects.bulkPutFleetDriverProductConfigurationsByIdSuccess$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.configurationChanges.clear();
        this.driversStore.dispatch(
          driversActions.getFleetDriverProductsConfigurations({
            fleetId: this.selectedFleet.id,
            driverId: this.driverId,
          }),
        );
      });

    this.driversEffects.putFleetDriverProductsConfigurationsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (this.configurationChanges.size > 0) {
        this.driversStore.dispatch(
          driversActions.bulkPutFleetDriverProductConfigurationsById({
            fleetId: this.selectedFleet.id,
            driverId: this.driverId,
            body: Array.from(this.configurationChanges.entries(), ([key, value]) => ({
              id: key,
              configuration: value,
            })),
          }),
        );
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public openConfiguration(configuration: DriverProductConfigurationsDto): void {
    this.activeProductId = configuration.product.id;

    const configurationComponentRef = this.uiService.openDynamicComponent(ProductConfigurationComponent, this.vcr, {
      clearPrevious: true,
    });

    const changes = this.configurationChanges.get(configuration.product.id) || {};

    configurationComponentRef.setInput('driverId', this.driverId);
    configurationComponentRef.setInput('fleetId', this.selectedFleet.id);
    configurationComponentRef.setInput('configuration', { ...configuration, ...changes });
    configurationComponentRef.setInput('isDriverBlocked', this.isDriverBlocked);

    configurationComponentRef.instance.close.pipe(take(1)).subscribe(() => {
      this.activeProductId = null;
      this.cdr.detectChanges();
    });

    configurationComponentRef.instance.configurationChange
      .pipe(takeUntil(configurationComponentRef.instance.close))
      .subscribe(({ to_allow_edit_by_driver }) => {
        const { id } = configurationComponentRef.instance.configuration.product;
        const { accessibility_rules_activations, editing_accessibility_rules_activations } =
          this.getProductConfiguration(id);

        this.configurationChanges.set(id, {
          accessibility_rules_activations,
          editing_accessibility_rules_activations,
          to_allow_edit_by_driver,
        });
      });
  }

  public getFormGroup(productId: string): UntypedFormGroup {
    return this.productsFormArray.controls.find((c) => c.get('product_id').value === productId) as UntypedFormGroup;
  }

  public setProducts(products: DriverProductConfigurationsDto[]): void {
    this.productsFormArray = new UntypedFormArray([]);

    products.forEach((product) => {
      const form = new UntypedFormGroup({
        product_id: new UntypedFormControl(product?.product?.id),
        is_available: new UntypedFormControl({
          value: product.availability.is_available,
          disabled: !product.is_editable || this.isDriverBlocked,
        }),
      });
      this.productsFormArray.push(form);
    });

    this.productsFormArray.setValidators(
      this.isValueChangedValidator(products, this.productsFormArray.controls as UntypedFormGroup[]),
    );
    this.productsFormArray.updateValueAndValidity();
  }

  public updateProductsConfiguration(): void {
    const products = this.productsFormArray.value.filter(
      (product: { id: string; is_available?: boolean }, index: number) =>
        product?.is_available !== this.productsList[index].availability.is_available,
    );
    const payload = {
      driverId: this.driverId,
      fleetId: this.selectedFleet.id,
      body: {
        items: products,
      },
    };

    this.driversStore.dispatch(driversActions.putFleetDriverProductsConfigurations(payload));
  }

  public stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  public filterList(displayActiveProducts: boolean): void {
    this.displayActiveProducts = displayActiveProducts;
    this.productsListFiltered = this.displayActiveProducts
      ? this.productsList.filter(
          (product) =>
            !product.availability.is_restricted_by_selected_vehicle &&
            !product.availability.is_restricted_by_vehicle_params,
        )
      : this.productsList
          .filter(
            (product) =>
              product.availability.is_restricted_by_selected_vehicle ||
              product.availability.is_restricted_by_vehicle_params,
          )
          .map((item) => {
            const control = this.getFormGroup(item.product.id);
            control?.disable();
            return item;
          });
  }

  private getProductConfiguration(id: string): DriverProductConfigurationsDto {
    return this.productsList.find((product) => product.product.id === id);
  }

  private isValueChangedValidator(defaultData: DriverProductConfigurationsDto[], forms: UntypedFormGroup[] = null) {
    return (): ValidationErrors | null => {
      if (!forms) {
        return null;
      }
      const result = forms.some(
        (form: UntypedFormGroup, index: number) =>
          form.get('is_available')?.value !== defaultData[index].availability.is_available,
      );
      return result ? null : { valueChangedError: true };
    };
  }
}
