import { FleetMerchant } from '@data-access';

import { Currency } from '@uklon/types';

import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { fleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { FleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { FleetDriverStatisticIntercept } from '../../../../support/interceptor/drivers/statistic';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverId = '*';

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverId);
const fleetDriverStatisticIntercept = new FleetDriverStatisticIntercept(fleetId, driverId, '*');
const driverRideConditions = new FleetDriverRideConditionsIntercept(fleetId, driverId);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept('*');

const profitStatistic = {
  order: {
    cash: {
      amount: 9500,
      currency: Currency.UAH,
    },
    merchant: {
      amount: 19_500,
      currency: Currency.UAH,
    },
    card: {
      amount: 29_500,
      currency: Currency.UAH,
    },
    wallet: {
      amount: 39_500,
      currency: Currency.UAH,
    },
    total: {
      amount: 9500,
      currency: Currency.UAH,
    },
  },
  tips: {
    amount: 3500,
    currency: Currency.UAH,
  },
  promotion: {
    amount: 4500,
    currency: Currency.UAH,
  },
  compensation: {
    amount: 5500,
    currency: Currency.UAH,
  },
};

const split = [
  {
    payment_provider: FleetMerchant.FONDY,
    merchant_id: '51ba95fa-c0e0-4afb-b8ab-c9737d69545b',
    total: {
      amount: 9500,
      currency: Currency.UAH,
    },
    fee: {
      amount: 9500,
      currency: Currency.UAH,
    },
  },
];

const lossStatistic = {
  total: {
    amount: -1000,
    currency: Currency.UAH,
  },
  order: {
    total: {
      amount: -1500,
      currency: Currency.UAH,
    },
    wallet: {
      amount: -2500,
      currency: Currency.UAH,
    },
  },
};

const translations = {
  uk: {
    cash: 'Готівка',
    card: 'На карту',
    wallet: 'На баланс',
    merchant: 'Мерчант',
    fine: 'Штрафи',
    commission: 'Комісія Uklon',
    tips: 'Чайові',
    bonus: 'Бонуси',
    compensation: 'Компенсація',
    tooltip: {
      title: 'Мерчант',
      cost: 'Сума',
      commission: 'Комісія',
    },
  },
  en: {
    cash: 'Cash',
    card: 'To card',
    wallet: 'To balance',
    merchant: 'Merchant',
    fine: 'Fines',
    commission: 'Uklon commission',
    tips: 'Tips',
    bonus: 'Bonuses',
    compensation: 'Compensation',
    tooltip: {
      title: 'Merchant',
      cost: 'Cost',
      commission: 'Commission',
    },
  },
};

function checkTexts(lang): void {
  const t = translations[lang];
  cy.getBySel('statistic-list-cash-title').should('contain', t.cash);
  cy.getBySel('statistic-list-card-title').should('contain', t.card);
  cy.getBySel('statistic-list-wallet-title').should('contain', t.wallet);
  cy.getBySel('statistic-list-merchant-title').should('contain', t.merchant);

  // Fines panel
  cy.getBySel('statistic-list-fine-title').should('contain', t.fine);
  cy.getBySel('statistic-list-commission-title').should('contain', t.commission);

  // Tips panel
  cy.getBySel('statistic-list-tips-title').should('contain', t.tips);
  cy.getBySel('statistic-list-bonus-title').should('contain', t.bonus);
  cy.getBySel('statistic-list-compensation-title').should('contain', t.compensation);

  cy.getBySel('statistic-list-merchant-tooltip').click();

  // Merchant tooltip
  cy.getBySel('tooltip-merchat-title').should('contain', t.tooltip.title);
  cy.getBySel('tooltip-cost-title').should('contain', t.tooltip.cost);
  cy.getBySel('tooltip-commission-title').should('contain', t.tooltip.commission);
}

describe('Driver details statistic tab', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetDriverIntercept.apply({ name: 'ok' });
      fleetDriverStatisticIntercept.apply({
        name: 'ok',
        props: { profit: profitStatistic, split_payments: split, loss: lossStatistic },
      });
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
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
  });

  if (isMockingData()) {
    it('should navigate to driver page', () => {
      cy.url().should('include', `/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
    });
  }

  describe('Job statistics', () => {
    if (isMockingData()) {
      it('[5502] should display deatailed income statistics', () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('income-for-period').find('span').should('contain', '₴ 85.00');
        cy.getBySel('total-income').find('span').should('contain', '₴ 95.00');
        cy.getBySel('income-pie-chart').should('exist');
        cy.getBySel('fees-panel').should('exist');
        cy.getBySel('tips-panel').should('exist');
      });

      it('[PF-240] should should have active class for stats tab', () => {
        cy.get('.mdc-tab-indicator--active')
          .getBySel('driver-details-tabs-statistic')
          .should('contain', 'Статистика роботи');
      });

      it('[8085] should have empty state if no statistics is avaliable', () => {
        fleetDriverStatisticIntercept.apply({ name: 'bad' });
        cy.reload();

        cy.getBySel('no-data').should('exist');
      });

      it("[PF-242] should display driver's statistics", () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('driver-statistics').should('exist');
      });

      it("[PF-243] should display driver's rating", () => {
        cy.useDateRangeFilter('custom', '01.08.2023', '31.08.2023');
        cy.getBySel('rating-card').should('exist').get('.employee-info-item-value').should('contain', '—');
      });

      it("[PF-244] should display driver's completed orders count", () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('orders-card').should('exist').get('.employee-info-item-value').should('contain', '—');
      });

      it("[PF-245] should display driver's canceled orders count", () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('cancelation-card').should('exist').get('.employee-info-item-value').should('contain', '—');
      });

      it("[PF-246] should display driver's distance driven", () => {
        cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
        cy.getBySel('distance-card').should('exist').get('.employee-info-item-value').should('contain', '11.0 км');
      });

      describe('Driver statistics filter', () => {
        it("should not display reset button if filter didn't change", () => {
          cy.getBySel('filter-reset-btn').should('not.exist');
        });

        it('[PF-248] should display reset button if filter has changed', () => {
          cy.useDateRangeFilter('today');
          cy.getBySel('filter-reset-btn').should('exist');
        });

        it('[PF-249] should reset filter to default value on reset button click', () => {
          cy.useDateRangeFilter('today');
          cy.getBySel('filter-reset-btn').should('exist').click();
          cy.getBySel('date-range-select').get('.mat-mdc-select-value').should('contain', 'Поточний тиждень');
        });

        it('[PF-250] should have default filter value set to Current week', () => {
          cy.getBySel('date-range-select').get('.mat-mdc-select-value').should('contain', 'Поточний тиждень');
        });

        it('[PF-251] should have 9 options', () => {
          cy.getBySel('date-range-select').click();
          cy.getBySelLike('date-range-option').should('have.length', 9);
          cy.getBySelLike('date-range-option').eq(2).click();
        });
      });

      describe('Statistic details', () => {
        it('should display text in Ukrainian', () => {
          checkTexts('uk');
        });

        describe('Profit statistic', () => {
          describe('Merchant tooltip', () => {
            beforeEach(() => {
              cy.getBySel('statistic-list-merchant-tooltip').click();
            });

            it('should display merchant name', () => {
              cy.getBySel('merchant-merchant_001').within(() => {
                cy.getBySel('merchant-provider').should('contain', 'Fondy merchant_001');
              });
            });

            it('should display merchant total', () => {
              cy.getBySel('merchant-merchant_001').within(() => {
                cy.getBySel('merchant-total').should('contain', '₴ 100.00');
              });
            });

            it('should display merchant fee', () => {
              cy.getBySel('merchant-merchant_001').within(() => {
                cy.getBySel('merchant-fee').should('contain', '₴ 5.00');
              });
            });
          });

          const fieldValue = [
            {
              name: 'cash',
              amountsField: 'statistic-list-cash-amount',
              amount: '₴ 95.00',
              percent: '100.00%',
            },
            {
              name: 'card',
              amountsField: 'statistic-list-card-amount',
              amount: '₴ 295.00',
              percent: '310.53%',
            },
            {
              name: 'wallet',
              amountsField: 'statistic-list-wallet-amount',
              amount: '₴ 395.00',
              percent: '415.79%',
            },
            {
              name: 'merchant',
              amountsField: 'statistic-list-merchant-amount',
              amount: '₴ 195.00',
              percent: '205.26%',
            },
          ];

          fieldValue.forEach(({ name, amountsField, amount, percent }) => {
            describe(`${name} in profit list`, () => {
              it('Check curency amount', () => {
                cy.getBySel(amountsField).within(() => {
                  cy.getBySel('money-amount').should('contain', amount);
                });
              });

              it('Check curency percent', () => {
                cy.getBySel(amountsField).within(() => {
                  cy.getBySel('money-percent').should('contain', percent);
                });
              });
            });
          });

          it('should display -', () => {
            fleetDriverStatisticIntercept.apply({ name: 'ok', props: { profit: {}, split_payments: [] } });
            cy.reload();

            cy.getBySel('statistic-list-cash-amount').should('contain', '—');

            cy.getBySel('statistic-list-card-amount').should('contain', '—');

            cy.getBySel('statistic-list-wallet-amount').should('contain', '—');

            cy.getBySel('statistic-list-merchant-amount').should('contain', '—');
          });
        });

        describe('Tips and Fees', () => {
          const tipsAndFees = [
            { name: 'fine', field: 'statistic-list-fine-amount', value: '- ₴ 10.00' },
            { name: 'commission', field: 'statistic-list-commission-amount', value: '- ₴ 15.00' },
            { name: 'tips', field: 'statistic-list-tips-amount', value: '+ ₴ 35.00' },
            { name: 'bonus', field: 'statistic-list-bonus-amount', value: '+ ₴ 45.00' },
            { name: 'compensation', field: 'statistic-list-compensation-amount', value: '+ ₴ 55.00' },
          ];

          tipsAndFees.forEach(({ name, field, value }) => {
            it(`${name} check current amount`, () => {
              cy.getBySel(field).should('contain', value);
            });
          });

          it('should display -', () => {
            fleetDriverStatisticIntercept.apply({ name: 'ok', props: { profit: {}, split_payments: [] } });
            cy.reload();

            cy.getBySel('statistic-list-fine-amount').should('contain', '—');

            cy.getBySel('statistic-list-commission-amount').should('contain', '—');

            cy.getBySel('statistic-list-tips-amount').should('contain', '—');

            cy.getBySel('statistic-list-bonus-amount').should('contain', '—');

            cy.getBySel('statistic-list-compensation-amount').should('contain', '—');
          });
        });
      });
    }
  });
});
