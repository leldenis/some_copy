import { fleetDriverListIntercept } from '../../../../support/interceptor/drivers';
import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { FleetOrdersIntercept } from '../../../../support/interceptor/orders';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { vehicleAccessToDriversIntercept } from '../../../../support/interceptor/vehicles/access-to-drivers';
import { FleetVehicleDetailsIntercept } from '../../../../support/interceptor/vehicles/details';
import { isMockingData } from '../../../../support/utils';

const vehicleId = 'b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c';
const fleetId = '829492c9-29d5-41df-8e9b-14a407235ce1';

const fleetVehicleDetails = new FleetVehicleDetailsIntercept(fleetId, vehicleId);
const fleetOrders = new FleetOrdersIntercept(
  `fleetId=${fleetId}&vehicleId=${vehicleId}&from=*&to=*&limit=20&cursor=-1`,
);
const individualEntrepreneursIntercept = new IndividualEntrepreneursIntercept('*', true);

const ordersResponse = [
  {
    id: '1fad966ab2f4427ba0da4b04be5f871f',
    driver: {
      fullName: 'Aqaafeyh404 Aqadpilu404',
      id: '1fad966ab2f4427ba0da4b04be5f871f',
    },
    vehicle: {
      id: 'b5bbf6cadec64073a1db4b3bb4dd171c',
      licencePlate: 'AQA0001',
      productType: 'Standart',
    },
    route: {
      points: [
        {
          address: 'Строителей проспект, 37а',
        },
        {
          address: 'Победы проспект, 32/42',
        },
      ],
    },
    payment: {
      cost: 95,
      currency: 'UAH',
      distance: 11.81,
      feeType: 'cash',
      paymentType: 'cash',
    },
    status: 'completed',
    pickupTime: 1_684_764_504,
  },
];

describe('Vehicle Orders', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetVehicleDetails.apply({ name: 'ok', props: { id: vehicleId, license_plate: 'AQA0001' } });
      fleetOrders.apply({ name: 'ok', props: { items: ordersResponse } });
      individualEntrepreneursIntercept.apply({ name: 'ok', props: { entrepreneur: [] } });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      vehicleAccessToDriversIntercept.apply({ name: 'ok' });
      fleetDriverListIntercept.apply({ name: 'ok' });
    }
    cy.loginWithSession('vehicleOrdersHistory');
    cy.visit(`/workspace/vehicles/details/${vehicleId}#trips`);
    cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
  });

  it('[5538] should open orders tab', () => {
    cy.getBySel('row').should('exist');
  });

  it('[5539] should filter by date', () => {
    cy.getBySel('cell-pickupTime').should('contain', '22.05.2023');
  });
});
