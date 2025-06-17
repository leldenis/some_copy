import { AvailableDriverProduct, DriverFleetType } from '@constant';

import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { FleetDriverAccessibilityRulesMetricsIntercept } from '../../../../support/interceptor/drivers/accessibility-rules-metrics';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { FleetDriverProductsConfigurationsIntercept } from '../../../../support/interceptor/drivers/products-configurations';
import { fleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { FleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverId = '1fad966a-b2f4-427b-a0da-4b04be5f871f';

const productList = [
  // Bussines product
  {
    availability: {
      is_available: false,
      is_blocked: false,
      is_restricted_by_accessibility_rules: false,
      is_restricted_by_selected_vehicle: true,
      is_restricted_by_vehicle_params: true,
    },
    product: {
      id: '7389fd54-78c8-4fa3-aa4a-328f6d355691',
      name: AvailableDriverProduct.Business,
      code: AvailableDriverProduct.Business,
      condition_code: 'Business',
      condition_value: 'Business',
    },
  },
  // Standard product
  {
    accessibility_rules: {
      driver_fleet_type: DriverFleetType.ALL,
      max_allowed_cancel_percent: 100,
      min_completed_order_count: 15,
      min_rating: 0,
      min_work_time_days: 0,
    },
    editing_accessibility_rules: {
      driver_fleet_type: DriverFleetType.ALL,
      max_allowed_cancel_percent: 100,
      min_completed_order_count: 0,
      min_rating: 0,
      min_work_time_days: 60,
    },
    availability: {
      is_available: true,
      is_blocked: false,
      is_restricted_by_accessibility_rules: false,
      is_restricted_by_selected_vehicle: false,
      is_restricted_by_vehicle_params: false,
    },
    product: {
      id: '613d23ff-1ea8-4f8d-9e13-ee03539d465d',
      name: AvailableDriverProduct.Standard,
      code: AvailableDriverProduct.Standard,
      condition_code: 'Standard',
      condition_value: 'Standard',
    },
  },
  // Comfort product
  {
    availability: {
      is_available: false,
      is_blocked: false,
      is_restricted_by_accessibility_rules: false,
      is_restricted_by_selected_vehicle: true,
      is_restricted_by_vehicle_params: true,
    },
    product: {
      id: 'af181f32-0258-464e-897a-c7033f479dcd',
      name: AvailableDriverProduct.Comfort,
      code: AvailableDriverProduct.Comfort,
      condition_code: 'Comfort',
      condition_value: 'Comfort',
    },
    to_allow_edit_by_driver: false,
  },
  // Driver product
  {
    availability: {
      is_available: false,
      is_blocked: false,
      is_restricted_by_accessibility_rules: true,
      is_restricted_by_selected_vehicle: false,
      is_restricted_by_vehicle_params: false,
    },
    product: {
      id: '66682aab-3694-4cb3-8a3c-6f632bf6018f',
      name: AvailableDriverProduct.DriverAuto,
      code: AvailableDriverProduct.DriverAuto,
      condition_code: 'transmission_type',
      condition_value: 'auto',
    },
  },
];

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverId);
const driverAccessibilityRulesMetrics = new FleetDriverAccessibilityRulesMetricsIntercept(fleetId, driverId);
const driverProductsConfigurations = new FleetDriverProductsConfigurationsIntercept(fleetId, driverId);
const driverRideConditions = new FleetDriverRideConditionsIntercept(fleetId, driverId);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept('*');

describe('Driver details filters', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetDriverIntercept.apply({ name: 'ok' });
      driverAccessibilityRulesMetrics.apply({ name: 'ok' });
      driverProductsConfigurations.apply({ name: 'ok', props: { products_list: productList } });
      driverRideConditions.apply({ name: 'ok' });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    }

    cy.clearLocalStorage();
    cy.loginWithSession('driverDetailsTabs');
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#filters');
  });

  if (isMockingData()) {
    it('[PF-288] should should have active class for filters tab', () => {
      cy.get('.mdc-tab-indicator--active')
        .getBySel('driver-details-tabs-expandedFilters')
        .should('contain', 'Розширені фільтри');
    });

    it('[PF-289] should have order types and additional options blocks', () => {
      cy.getBySel('order-types').should('exist');
      cy.getBySel('additional-options').should('exist');
    });

    it('[PF-290] should have Save button disabled by default', () => {
      cy.getBySel('filters-save-btn').should('exist').should('be.disabled');
    });

    it('[PF-291] should have available/not-available filters toggle', () => {
      cy.getBySel('available-filters').should('exist').should('be.enabled').should('contain', '2');
      cy.getBySel('not-available-filters').should('exist').should('be.enabled').should('contain', '2');
    });
  }
  describe('Available filters', () => {
    let filtersAvailable = 6;

    if (isMockingData()) {
      filtersAvailable = 2;

      it('should toggle filters', () => {
        cy.getBySel('filter-option-613d23ff-1ea8-4f8d-9e13-ee03539d465d')
          .should('exist')
          .find('.mat-mdc-slide-toggle')
          .as('toggle');
        cy.get('@toggle').click();
        cy.get('@toggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');

        cy.get('@toggle').click();
        cy.get('@toggle').should('have.class', 'mat-mdc-slide-toggle-checked');
      });

      it('should enable Save button if filter change', () => {
        cy.getBySel('filter-option-613d23ff-1ea8-4f8d-9e13-ee03539d465d')
          .should('exist')
          .find('.mat-mdc-slide-toggle')
          .as('toggle');
        cy.get('@toggle').click();
        cy.getBySel('filters-save-btn').should('exist').should('be.enabled');
      });

      it("should keep Save button disabled if filters don't change after toggling", () => {
        cy.getBySel('filter-option-613d23ff-1ea8-4f8d-9e13-ee03539d465d')
          .should('exist')
          .find('.mat-mdc-slide-toggle')
          .as('toggle');
        cy.get('@toggle').click();
        cy.get('@toggle').click();
        cy.getBySel('filters-save-btn').should('exist').should('be.disabled');
      });

      it('should open product configuration', () => {
        cy.getBySel('filter-option-613d23ff-1ea8-4f8d-9e13-ee03539d465d').should('exist').click();
        cy.getBySel('product-configuration').should('exist');
      });

      it('should exist restricted-by-accessability-rules-message', () => {
        cy.getBySel('filter-option-66682aab-3694-4cb3-8a3c-6f632bf6018f').within(() => {
          cy.getBySel('restricted-by-accessability-rules-message').should('exist');
        });
      });
    }

    it('[5505] should have 6 filters available', () => {
      cy.get('[data-cy*="filter-option"').should('exist').should('have.length', filtersAvailable);
    });
  });

  if (isMockingData()) {
    describe('Not available filters', () => {
      let filtersAvailable = 8;
      filtersAvailable = 2;

      beforeEach(() => {
        cy.getBySel('not-available-filters').should('exist').click();
      });

      it('should have 8 not available filters', () => {
        cy.get('[data-cy*="filter-option"').should('exist').should('have.length', filtersAvailable);
      });

      it('should have Blocked status badge', () => {
        cy.getBySel('filter-option-af181f32-0258-464e-897a-c7033f479dcd')
          .should('exist')
          .getBySel('blocked-badge')
          .should('exist')
          .should('contain', 'Заблоковано');
      });

      it('should open product configuration', () => {
        cy.getBySel('filter-option-7389fd54-78c8-4fa3-aa4a-328f6d355691').should('exist').click();
        cy.getBySel('product-configuration').should('exist');
      });
    });

    describe('Product configuration', () => {
      beforeEach(() => {
        cy.getBySel('filter-option-613d23ff-1ea8-4f8d-9e13-ee03539d465d').click();
      });

      it('should contain accessibility rules values', () => {
        cy.get('[data-cy*="product-rules"')
          .eq(0)
          .within(() => {
            cy.getBySel('item-value-0').should('contain', '0.0');
            cy.getBySel('item-value-2').should('contain', '15');
            cy.getBySel('item-value-4').should('contain', '0');
          });
      });

      it('should contain editing rules', () => {
        cy.get('[data-cy*="product-rules"')
          .eq(1)
          .within(() => {
            cy.getBySel('item-value-0').should('contain', '0.0');
            cy.getBySel('item-value-2').should('contain', '0');
            cy.getBySel('item-value-4').should('contain', '60');
          });
      });

      it('should contain driver metrics', () => {
        cy.get('[data-cy*="product-rules"')
          .eq(0)
          .within(() => {
            cy.getBySel('item-value-1').should('contain', '5.0');
            cy.getBySel('item-value-3').should('contain', '10');
            cy.getBySel('item-value-5').should('contain', '50');
          });

        cy.get('[data-cy*="product-rules"')
          .eq(1)
          .within(() => {
            cy.getBySel('item-value-1').should('contain', '5.0');
            cy.getBySel('item-value-3').should('contain', '10');
            cy.getBySel('item-value-5').should('contain', '50');
          });
      });

      it('should have red values', () => {
        cy.get('[data-cy*="product-rules"')
          .eq(0)
          .within(() => {
            cy.getBySel('item-value-3')
              .should('have.class', 'upf-danger')
              .and('have.css', 'color')
              .then((color) => {
                expect(color).to.eq('rgb(191, 14, 8)');
              });
          });

        cy.get('[data-cy*="product-rules"')
          .eq(1)
          .within(() => {
            cy.getBySel('item-value-5')
              .should('have.class', 'upf-danger')
              .and('have.css', 'color')
              .then((color) => {
                expect(color).to.eq('rgb(191, 14, 8)');
              });
          });
      });
    });

    describe('Additional options', () => {
      it('should have enabled/disabled ride conditions blocks', () => {
        cy.getBySel('enabled-ride-conditions').should('exist');
        cy.getBySel('disabled-ride-conditions').should('exist');
      });

      it('should have disabled conditions', () => {
        cy.getBySel('disabled-ride-conditions')
          .should('exist')
          .getBySel('condition-badge')
          .should('exist')
          .should('have.length', 2)
          .should('contain', 'Допомога з завантаженням вантажу');
      });
    });
  }
});
