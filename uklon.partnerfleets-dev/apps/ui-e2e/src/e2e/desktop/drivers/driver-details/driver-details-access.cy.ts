import { BlockedListStatusValue, DriverVehicleAccessType } from '@constant';
import { FleetVehicleDto } from '@data-access';

import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { FleetDriverAccessToVehicleIntercept } from '../../../../support/interceptor/drivers/access-to-vehicles';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { fleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { fleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { FleetVehiclesListIntercept } from '../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverId = '*';
const vehicleQuery = 'licencePlate=*&limit=*&offset=*';
const vehicleSearchResult: FleetVehicleDto = [
  {
    licencePlate: 'AA3445TT',
  },
  {
    licencePlate: 'AA3446TT',
  },
];

const vehicleItems: FleetVehicleDto[] = [{ id: '27d8c48f-dc09-4774-ae9a-ba35360d7a02', licencePlate: 'FGNFN' }];

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverId);
const fleetDriverAccessToVehicleIntercept = new FleetDriverAccessToVehicleIntercept(fleetId, driverId);
const fleetVehiclesListIntercept = new FleetVehiclesListIntercept(fleetId, vehicleQuery);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept('*');

if (isMockingData()) {
  describe('Driver details access tab', () => {
    beforeEach(() => {
      fleetVehiclesListIntercept.apply({ name: 'ok', props: { vehicle_list: vehicleSearchResult } });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRideConditionsIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    });

    describe('Driver accessibility settings', () => {
      beforeEach(() => {
        fleetDriverIntercept.apply({ name: 'ok', props: { vehicle: false } });
        fleetDriverAccessToVehicleIntercept.apply({
          name: 'ok',
          props: { access_type: DriverVehicleAccessType.SPECIFIC_VEHICLES, items: vehicleItems },
        });

        cy.clearLocalStorage();
        cy.loginWithSession('driverDetailsTabs');
        cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#access');
      });

      it('[PF-252] should have active class for accessibility tab', () => {
        cy.get('.mdc-tab-indicator--active').getBySel('driver-details-tabs-access').should('contain', 'Доступ');
      });

      it('[PF-253] should have 3 accessibility options', () => {
        cy.getBySel('access-all-cars-radio').should('exist');
        cy.getBySel('access-specific-drivers-radio').should('exist');
        cy.getBySel('access-nobody-radio').should('exist');
      });

      it('should search by licanse plate', () => {
        cy.getBySel('vehicles-accessibility-autocomplete-input').type('AA34');
        cy.getBySel('search-vehicle-AA3445TT').should('be.visible');
      });

      it('should have error message when no vehicle in list', () => {
        cy.getBySel('vehicle-FGNFN').find('.mat-mdc-chip-remove').click();
        cy.getBySel('save-vehicles-accessibility-btn').click();

        cy.getBySel('no-vehicle-error-message').should('be.visible');
      });
    });

    describe('Driver have selected vehicle', () => {
      beforeEach(() => {
        fleetDriverIntercept.apply({ name: 'ok' });
        fleetDriverAccessToVehicleIntercept.apply({
          name: 'ok',
          props: { access_type: DriverVehicleAccessType.SPECIFIC_VEHICLES, items: vehicleItems },
        });

        cy.clearLocalStorage();
        cy.loginWithSession('driverDetailsTabs');
        cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#access');
      });

      it('should have Nobody option disabled, if driver has active connection with vehicle', () => {
        cy.getBySel('access-nobody-radio').find('input[type="radio"]').should('be.disabled');
      });

      it('shoul have selected vehicle first in list', () => {
        cy.get('mat-chip').eq(0).should('contain', 'AQA0001');
      });

      it('shoul not have remove button  only for selected vehicle', () => {
        cy.getBySel('vehicle-AQA0001').find('.mat-mdc-chip-remove').should('not.exist');
        cy.getBySel('vehicle-FGNFN').find('.mat-mdc-chip-remove').should('exist');
      });
    });

    describe('Driver is blocked', () => {
      beforeEach(() => {
        fleetDriverIntercept.apply({ name: 'ok', props: { status: BlockedListStatusValue.BLOCKED } });
        fleetDriverAccessToVehicleIntercept.apply({
          name: 'ok',
          props: { access_type: DriverVehicleAccessType.SPECIFIC_VEHICLES, items: vehicleItems },
        });

        cy.clearLocalStorage();
        cy.loginWithSession('driverDetailsTabs');
        cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#access');
      });

      it('should have all options disabled, if driver blocked', () => {
        cy.getBySel('access-all-cars-radio').find('input[type="radio"]').should('be.disabled');
        cy.getBySel('access-specific-drivers-radio').find('input[type="radio"]').should('be.disabled');
        cy.getBySel('access-nobody-radio').find('input[type="radio"]').should('be.disabled');
      });
    });
  });
}
