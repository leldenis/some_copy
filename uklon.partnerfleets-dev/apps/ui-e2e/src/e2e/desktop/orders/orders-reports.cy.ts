import { MoneyDto } from '@data-access';

import { Currency } from '@uklon/types';

import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { FleetOrdersReportsIntercept } from '../../../support/interceptor/orders-reports';
import { isMockingData } from '../../../support/utils';

const fleetOrdersReports = new FleetOrdersReportsIntercept(`*`, `*`);

function getMoney(amount: number): MoneyDto {
  return {
    amount,
    currency: Currency.UAH,
  };
}

const ordersReportsResponse = [
  {
    driver: {
      first_name: 'Aqadpilu404',
      last_name: 'Aqaafeyh404',
      id: '1fad966a-b2f4-427b-a0da-4b04be5f871f',
      signal: 500_265,
    },
    total_orders_count: 1,
    total_distance_meters: 11_813,
    total_distance_to_pickup_meters: 80,
    total_executing_time: 0,
    average_price_per_kilometer: getMoney(79_879),
    average_order_price_per_kilometer: getMoney(79_879),
    average_order_price_per_hour: getMoney(0),
    orders_per_hour: 0,
    bonuses: {
      branding: getMoney(0),
      guaranteed: getMoney(0),
      individual: getMoney(0),
      order: getMoney(0),
      total: getMoney(0),
      week: getMoney(0),
    },
    compensation: {
      absence: getMoney(0),
      ticket: getMoney(0),
      total: getMoney(0),
    },
    tips: getMoney(0),
    penalties: getMoney(0),
    profit: {
      card: getMoney(0),
      cash: getMoney(9500),
      merchant: getMoney(0),
      order: getMoney(9500),
      total: getMoney(9500),
      wallet: getMoney(0),
    },
    commission: {
      actual: getMoney(0),
      total: getMoney(0),
    },
    transfers: {
      from_balance: getMoney(0),
      replenishment: getMoney(0),
    },
    split_payments: [],
    grouped_splits: {},
    currency: Currency.UAH,
    online_time_seconds: 0,
    chain_time_seconds: 0,
    offer_time_seconds: 0,
    broadcast_time_seconds: 0,
    total_time_from_accepted_to_running: 0,
  },
];

describe('Orders reports', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetOrdersReports.apply({ name: 'ok', props: { items: ordersReportsResponse } });
      fleetDriverListIntercept.apply({ name: 'ok' });
    }
    cy.clearLocalStorage();
    cy.loginWithSession('ordersReports');
    cy.visit('workspace/orders');
  });

  it.skip('[PF-355] should display empty state', () => {
    cy.getBySel('no-data').should('exist').should('be.visible');
  });

  describe('Orders tabs', () => {
    it('[4021] should have orders reports tab active', () => {
      cy.get('.mdc-tab-indicator--active').should('exist').should('contain', 'Звіт про поїздки');
    });
  });

  describe('Orders reports filters', () => {
    it('[5544] should have date and drivers filters', () => {
      cy.getBySel('orders-reports-date-filter').should('exist');
      cy.getBySel('drivers-control').should('exist');
    });

    if (isMockingData()) {
      it.skip('[PF-359] should have default filters values', () => {
        cy.getBySel('orders-reports-date-filter').should('contain', 'Поточний тиждень');
        cy.getBySel('drivers-control').should('contain', '');
      });

      it.skip('[PF-360] should display Clear button if date filter changed', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('filter-reset-btn').should('exist');
      });

      it.skip('[PF-361] should display Clear button if driver filter changed', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useDriverFilter();
        cy.getBySel('filter-reset-btn').should('exist');
      });

      it.skip('[PF-362] should reset filters to default on Clear button click', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useDriverFilter();
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.getBySel('orders-reports-date-filter').should('contain', 'Поточний тиждень');
        cy.getBySel('drivers-control').should('contain', '');
      });

      it.skip('[PF-363] should not display Clear button if selected filters are the same as default', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useDriverFilter();
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.useDateRangeFilter();
        cy.getBySel('filter-reset-btn').should('not.exist');
      });
    }
  });

  if (isMockingData()) {
    describe('Export csv', () => {
      it('[PF-364] should have export csv button', () => {
        cy.getBySel('export-csv-btn-desktop').should('exist').should('be.visible');
      });

      it.skip('[4612] should download csv file on button click', () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('export-csv-btn-desktop').should('be.visible').click();
        cy.readFile(`${Cypress.config('downloadsFolder')}/Звіт по поїздкам - 00.00 01.05.2023 - 23.59 31.05.2023.csv`);
      });
    });

    describe('Orders reports list', () => {
      beforeEach(() => cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023'));

      it('[PF-366] should display orders reports list', () => {
        cy.getBySel('orders-reports-list').should('exist').should('be.visible');
      });

      it('[PF-367] should have header row', () => {
        cy.getBySel('orders-reports-header-row').should('exist').should('be.visible');
      });

      it('[PF-367] should have data row', () => {
        cy.getBySel('orders-reports-row').should('exist').should('be.visible');
      });

      describe('Header row', () => {
        it('[PF-369] should have driver/signal header', () => {
          cy.getBySel('driver-header').should('be.visible').should('contain', 'Водій').should('contain', 'Позивний');
        });

        it('[PF-370] should have rides header', () => {
          cy.getBySel('rides-header').should('be.visible').should('contain', 'Поїздки');
        });

        it('[PF-371] should have total distance header', () => {
          cy.getBySel('total-distance-header').should('be.visible').should('contain', 'Пробіг (під замовленням)');
        });

        it('[PF-372] should have total amount header', () => {
          cy.getBySel('total-amount-header').should('be.visible').should('contain', 'Загальна вартість');
        });

        it('[PF-373] should have total price header', () => {
          cy.getBySel('total-price-header').should('be.visible').should('contain', 'Разом');
          cy.getBySel('total-price-icon').should('be.visible');
        });
      });

      describe('Data row', () => {
        it('[PF-374] should have driver/signal cell', () => {
          cy.getBySel('driver-cell')
            .should('be.visible')
            .should('contain', 'Aqaafeyh404 Aqadpilu404')
            .should('contain', '500265');

          cy.getBySel('driver-cell')
            .find('a')
            .should('exist')
            .should('have.attr', 'href', '/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
        });

        it('[PF-375] should have rides cell', () => {
          cy.getBySel('rides-cell').should('be.visible').should('contain', 1);
        });

        it('[PF-376] should have total distance cell', () => {
          cy.getBySel('total-distance-cell').should('be.visible').should('contain', '11.81 км');
        });

        it('[PF-377] should have total amount cell', () => {
          cy.getBySel('total-amount-cell').should('be.visible').should('contain', '₴ 95.00');
        });

        it('[PF-378] should have total price cell', () => {
          cy.getBySel('total-price-cell').should('be.visible').should('contain', '₴ 95.00');
        });

        it('[PF-379] should have expand cell', () => {
          cy.getBySel('expand-cell').should('be.visible');
        });

        it('[PF-380] should toggle expandable row visibility', () => {
          cy.getBySel('expandable-row').should('not.be.visible');
          cy.getBySel('expand-cell').find('button').click();
          cy.getBySel('expandable-row').should('be.visible');
          cy.getBySel('expand-cell').find('button').click();
          cy.getBySel('expandable-row').should('not.be.visible');
        });
      });

      describe('Expandable row', () => {
        beforeEach(() => {
          cy.getBySel('expandable-row').should('not.be.visible');
          cy.getBySel('expand-cell').find('button').click();
          cy.getBySel('expandable-row').should('be.visible');
        });

        it('[4611] should have total amount, additional income and expenses sections', () => {
          cy.getBySel('total-amount-section').should('be.visible');
          cy.getBySel('additional-income-section').should('be.visible');
          cy.getBySel('expenses-section').should('be.visible');
        });

        describe('Total amount section', () => {
          it.skip('[PF-382] should have title', () => {
            cy.getBySel('total-amount-section-title').should('exist').should('contain', 'Загальна вартість');
          });

          it.skip('[PF-383] should disaply income source', () => {
            cy.getBySel('total-amount-section')
              .find('li:nth-child(1)')
              .should('exist')
              .should('contain', 'Готівка')
              .should('contain', '₴ 95.00');

            cy.getBySel('total-amount-section')
              .find('li:nth-child(2)')
              .should('exist')
              .should('contain', 'Гаманець')
              .should('contain', '0');

            cy.getBySel('total-amount-section')
              .find('li:nth-child(3)')
              .should('exist')
              .should('contain', 'На карту')
              .should('contain', '0');
          });
        });

        describe('Additional income section', () => {
          it.skip('[PF-384] should have title', () => {
            cy.getBySel('additional-income-section-title').should('exist').should('contain', 'Додаткові надходження');
          });

          it.skip('[PF-385] should display additional income info', () => {
            cy.getBySel('additional-income-section')
              .find('li:nth-child(1)')
              .should('exist')
              .should('contain', 'Компенсація')
              .should('contain', '0');

            cy.getBySel('additional-income-section')
              .find('li:nth-child(2)')
              .should('exist')
              .should('contain', 'Чайові')
              .should('contain', '0');
          });
        });

        describe('Expenses section', () => {
          it.skip('[PF-386] should have title', () => {
            cy.getBySel('expenses-section-title').should('exist').should('contain', 'Витрати');
          });

          it.skip('[PF-387] should display expenses info', () => {
            cy.getBySel('expenses-section')
              .find('li:nth-child(1)')
              .should('exist')
              .should('contain', 'Штраф')
              .should('contain', '0');

            cy.getBySel('expenses-section')
              .find('li:nth-child(2)')
              .should('exist')
              .should('contain', 'Комісія Uklon')
              .should('contain', '0');
          });
        });
      });
    });
  }
});
