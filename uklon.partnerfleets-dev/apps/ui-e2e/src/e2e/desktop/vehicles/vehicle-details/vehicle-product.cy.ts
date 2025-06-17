import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { vehicleAccessToDriversIntercept } from '../../../../support/interceptor/vehicles/access-to-drivers';
import { FleetVehicleDetailsIntercept } from '../../../../support/interceptor/vehicles/details';
import { FleetVehicleProductsIntercept } from '../../../../support/interceptor/vehicles/details/vehicle-products';
import { isMockingData } from '../../../../support/utils';

const vehicleId = 'ebe250ef-25fe-4c30-bb52-1a9bc495fca6';
const fleetId = '829492c9-29d5-41df-8e9b-14a407235ce1';

const fleetVehicleDetails = new FleetVehicleDetailsIntercept(fleetId, vehicleId);
const fleetVehicleProducts = new FleetVehicleProductsIntercept(fleetId, vehicleId);
const individualEntrepreneursIntercept = new IndividualEntrepreneursIntercept(fleetId, true);

describe('Vehicle Product', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetVehicleDetails.apply({ name: 'ok', props: { id: vehicleId, license_plate: 'AQA7297' } });
      fleetVehicleProducts.apply({ name: 'ok' });
      individualEntrepreneursIntercept.apply({ name: 'ok', props: { entrepreneur: [] } });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      vehicleAccessToDriversIntercept.apply({ name: 'ok' });
    }
    cy.loginWithSession('vehicleProduct');
    cy.visit(`/workspace/vehicles/details/${vehicleId}`);
  });

  it('[5533] should display active product', () => {
    cy.getBySel('product-9c714251-9306-4a4e-b65b-41af5a6eef46-true').should('exist');
  });

  it.skip('[5533] should display inactive product', () => {
    cy.getBySel('product-7389fd54-78c8-4fa3-aa4a-328f6d355691-false').should('exist');
  });
});
