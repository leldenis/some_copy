import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { FleetDriverFinanceProfileIntercept } from '../../../../support/interceptor/drivers/finance-profile';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { FleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { FleetDriverRestrictionsSettingsIntercept } from '../../../../support/interceptor/drivers/restrictions-settings';
import { FleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverId = '*';

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverId);
const fleetDriverFinanceProfileIntercept = new FleetDriverFinanceProfileIntercept(fleetId, driverId);
const fleetDriverRestrictionsIntercept = new FleetDriverRestrictionsIntercept(fleetId, driverId);
const fleetDriverRestrictionsSettingsIntercept = new FleetDriverRestrictionsSettingsIntercept(fleetId, driverId);
const driverRideConditions = new FleetDriverRideConditionsIntercept(fleetId, driverId);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept('*');

describe('Driver details restrictions settings', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetDriverIntercept.apply({ name: 'ok' });
      fleetDriverFinanceProfileIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsSettingsIntercept.apply({ name: 'ok' });
      driverRideConditions.apply({ name: 'ok' });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    }
    cy.clearLocalStorage();
    cy.loginWithSession('driverDetailsTabs');
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#restrictions');
  });

  it('[5506] should should have active class for trips tab', () => {
    cy.get('.mdc-tab-indicator--active')
      .getBySel('driver-details-tabs-restrictions')
      .should('contain', 'Налаштування обмежень');
  });

  if (isMockingData()) {
    it('should have orders and finance restirictions blocks', () => {
      cy.getBySel('orders-restrictions').should('exist');
      cy.getBySel('finance-restrictions').should('exist');
    });

    it('should have disabled Save button if setting were not changed', () => {
      cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.disabled');
    });
  }

  describe('Orders restrictions', () => {
    it('[5509] should enable Save button if restrictions change', () => {
      cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.disabled');
      cy.getBySel('order-restriction-0').should('exist').find('.mat-mdc-slide-toggle').should('exist').click();
      cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.enabled');
    });

    if (isMockingData()) {
      it('should have 3 options', () => {
        cy.getBySel('order-restriction-0').should('exist').should('contain', 'Робота з ефіром');
        cy.getBySel('order-restriction-1').should('exist').should('contain', 'Робота з фільтрами');
        cy.getBySel('order-restriction-2')
          .should('exist')
          .should('contain', 'Отримання замовлень з розрахунком за готівку');
      });

      it('should toggle restrictions', () => {
        for (let i = 0; i < 3; i += 1) {
          cy.getBySel(`order-restriction-${i}`).find('.mat-mdc-slide-toggle').as('toggle');
          cy.get('@toggle').should('exist').click();
          cy.get('@toggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');
          cy.get('@toggle').should('exist').click();
          cy.get('@toggle').should('have.class', 'mat-mdc-slide-toggle-checked');
        }
      });

      it('should contain fleet restrictions', () => {
        cy.getBySel(`order-restriction-0`).should('contain', 'Автопарк');
      });

      it('should contain manager restrictions', () => {
        cy.getBySel(`order-restriction-2`).should('contain', 'Менеджер уклон');
      });
    }
  });

  if (isMockingData()) {
    describe('Finance restrictions', () => {
      it('should have 2 options', () => {
        cy.getBySel('finance-restriction-payment-to-card')
          .should('exist')
          .should('contain', 'Отримання грошей на карту');

        cy.getBySel('finance-restriction-wallet-to-card')
          .should('exist')
          .should('contain', 'Виведення грошей на карту');
      });

      it('should have info, about who enabled restriction', () => {
        cy.getBySel('restriction-activator-payment-to-card').should('exist').should('contain', 'Менеджер уклон');

        cy.getBySel('restriction-activator-wallet-to-card').should('exist').should('contain', 'Менеджер уклон');
      });

      it('should toggle restrictions', () => {
        cy.getBySel('finance-restriction-payment-to-card').find('.mat-mdc-slide-toggle').as('paymentToggle');
        cy.getBySel('finance-restriction-wallet-to-card').find('.mat-mdc-slide-toggle').as('walletToggle');

        cy.get('@paymentToggle').should('exist').click();
        cy.get('@paymentToggle').should('have.class', 'mat-mdc-slide-toggle-checked');
        cy.get('@paymentToggle').should('exist').click();
        cy.get('@paymentToggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');

        cy.get('@walletToggle').should('exist').click();
        cy.get('@walletToggle').should('have.class', 'mat-mdc-slide-toggle-checked');
        cy.get('@walletToggle').should('exist').click();
        cy.get('@walletToggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');
      });

      it('should enable Save button if restrictions change', () => {
        cy.getBySel('finance-restriction-payment-to-card').find('.mat-mdc-slide-toggle').should('exist').click();
        cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.enabled');
      });
    });
  }
});
