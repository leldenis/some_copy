describe.skip('Driver details restrictions tab', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginWithSession('driverDetailsTabs');
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f');
    cy.getBySel('mobile-menu-toggle-btn').as('menu').should('exist');
    cy.getBySel('logout').as('logout').should('exist');
  });

  after(() => {
    cy.get('@menu').click();
    cy.get('@logout').click();
  });

  it.skip('[PF-1168] should navigate to driver page', () => {
    cy.url().should('include', `/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
  });

  describe('Driver restrictions settings', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-restrictions').should('exist').click();
    });

    it.skip('[PF-1233] should should have active class for trips tab', () => {
      cy.get('.mdc-tab-indicator--active')
        .getBySel('driver-details-tabs-restrictions')
        .should('contain', 'Налаштування обмежень');
    });

    it.skip('[PF-1234] should have orders and finance restirictions blocks', () => {
      cy.getBySel('orders-restrictions').should('exist');
      cy.getBySel('finance-restrictions').should('exist');
    });

    it.skip('[PF-1235] should have disabled Save button if setting were not changed', () => {
      cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.disabled');
    });

    describe('Orders restrictions', () => {
      it.skip('[PF-1236] should have 3 options', () => {
        cy.getBySel('order-restriction-0').should('exist').should('contain', 'Робота з ефіром');
        cy.getBySel('order-restriction-1').should('exist').should('contain', 'Робота з фільтрами');
        cy.getBySel('order-restriction-2')
          .should('exist')
          .should('contain', 'Отримання замовлень з розрахунком за готівку');
      });

      it.skip('[PF-1237] should toggle restrictions', () => {
        for (let i = 0; i < 3; i += 1) {
          cy.getBySel(`order-restriction-${i}`).find('.mat-mdc-slide-toggle').as('toggle');
          cy.get('@toggle').should('exist').click();
          cy.get('@toggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');
          cy.get('@toggle').should('exist').click();
          cy.get('@toggle').should('have.class', 'mat-mdc-slide-toggle-checked');
        }
      });

      it.skip('[PF-1238] should enable Save button if restrictions change', () => {
        cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.disabled');
        cy.getBySel('order-restriction-0').find('.mat-mdc-slide-toggle').should('exist').click();
        cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.enabled');
      });
    });

    describe('Finance restrictions', () => {
      it.skip('[PF-1239] should have 2 options', () => {
        cy.getBySel('finance-restriction-payment-to-card')
          .should('exist')
          .should('contain', 'Отримання грошей на карту');

        cy.getBySel('finance-restriction-wallet-to-card')
          .should('exist')
          .should('contain', 'Виведення грошей на карту');
      });

      it.skip('[PF-1240] should have info, about who enabled restriction', () => {
        cy.getBySel('restriction-activator-payment-to-card').should('exist').should('contain', 'Менеджер уклон');

        cy.getBySel('restriction-activator-wallet-to-card').should('exist').should('contain', 'Менеджер уклон');
      });

      it.skip('[PF-1241] should toggle restrictions', () => {
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

      it.skip('[PF-1242] should enable Save button if restrictions change', () => {
        cy.getBySel('finance-restriction-payment-to-card').find('.mat-mdc-slide-toggle').should('exist').click();
        cy.getBySel('driver-restrictions-save-btn').should('exist').should('be.enabled');
      });
    });
  });
});
