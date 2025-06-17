import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { FleetOrdersIntercept } from '../../../support/interceptor/orders';
import { isMockingData } from '../../../support/utils';

const fleetOrders = new FleetOrdersIntercept(`*`);

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

describe('Orders List', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetOrders.apply({ name: 'ok', props: { items: ordersResponse } });
      fleetDriverListIntercept.apply({ name: 'ok' });
    }
    cy.clearLocalStorage();
    cy.loginWithSession('ordersReports');
    cy.visit('workspace/orders#trips');
    cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
  });

  it('[5545] table should exist', () => {
    cy.getBySel('orders-list-table').should('exist');
  });

  it('[5546] should filter by license plate', () => {
    cy.getBySel('license-plate-control').type('AQA0001');
    cy.getBySel('license-plate-AQA0001').should('contain', 'AQA0001');
  });

  it.skip('[5547] should download csv file on button click', () => {
    cy.getBySel('orders-list-upload-csv').should('be.visible').click();
    cy.readFile(`${Cypress.config('downloadsFolder')}/Поїздки - 00.00 01.05.2023 - 23.59 31.05.2023.csv`);
  });
});
