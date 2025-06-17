describe.skip('Driver details trips tab', () => {
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

  describe('Driver trips', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-orders').should('exist').click();
    });

    it.skip('[PF-1209] should should have active class for trips tab', () => {
      cy.get('.mdc-tab-indicator--active').getBySel('driver-details-tabs-orders').should('contain', 'Поїздки');
    });

    it.skip('[PF-1210] should display empty state', () => {
      cy.getBySel('no-data').should('exist').should('be.visible');
    });

    describe('Trips filters', () => {
      it.skip('[PF-1211] should have period filter', () => {
        cy.getBySel('trips-period-filter').should('exist').click();
        cy.getBySelLike('date-range-option').should('have.length', 9);
        cy.getBySelLike('date-range-option').eq(2).click();
      });

      it.skip('[PF-1212] should have License plate filter', () => {
        cy.getBySel('trips-licensePlate-filter').should('exist');
      });

      it.skip('[PF-1213] should have Status filter', () => {
        cy.getBySel('trips-status-filter').should('exist').click();
        cy.get('.mat-mdc-option').should('have.length', 4);
        cy.get('.mat-mdc-option').eq(0).click();
      });

      it.skip('[PF-1214] should have Product type filter', () => {
        cy.getBySel('trips-productType-filter').should('exist').click();
        cy.get('.mat-mdc-option').should('have.length', 19);
        cy.get('.mat-mdc-option').eq(0).click();
      });

      it.skip('[PF-1215] should display Clear btn if any filter is applied', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.getBySel('trips-licensePlate-filter').should('exist').type('TEST');
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.getBySel('filter-reset-btn').should('not.exist');
      });
    });

    describe('Trips grid', () => {
      beforeEach(() => cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023'));

      it.skip('[PF-1216] should have header row', () => {
        cy.getBySel('trips-licensePlace-header').should('exist').should('contain', 'Держ. номер');
        cy.getBySel('trips-pickupTime-header').should('exist').should('contain', 'Подача');
        cy.getBySel('trips-route-header').should('exist').should('contain', 'Маршрут');
        cy.getBySel('trips-cost-header').should('exist').should('contain', 'Вартість замовлення');
        cy.getBySel('trips-cost-header').should('exist').should('contain', 'Відст. за маршрутом');
        cy.getBySel('trips-paymentType-header').should('exist').should('contain', 'Тип оплати');
        cy.getBySel('trips-status-header').should('exist').should('contain', 'Статус');
        cy.getBySel('trips-productType-header').should('exist').should('contain', 'Тип продукту');
      });

      it.skip('[PF-1217] should have trip row', () => {
        cy.getBySel('row').eq(0).as('row').should('exist').should('have.length', 1);

        cy.get('@row')
          .getBySel('cell-licensePlate')
          .should('exist')
          .should('contain', 'AQA0001')
          .should('have.attr', 'href')
          .and('include', '/workspace/vehicles/details/b5bbf6cadec64073a1db4b3bb4dd171c');

        cy.get('@row')
          .getBySel('cell-pickupTime')
          .should('exist')
          .should('contain', '22.05.2023')
          .should('contain', '14:08');

        cy.get('@row')
          .getBySel('cell-route')
          .should('exist')
          .should('contain', 'Строителей проспект, 37а')
          .should('contain', 'Победы проспект, 32/42');

        cy.get('@row')
          .getBySel('cell-route')
          .find('a')
          .should('have.attr', 'href')
          .and(
            'include',
            '/workspace/orders/details/652fdc9b6135455e8fd830fb74cf6fe8?driverId=1fad966ab2f4427ba0da4b04be5f871f',
          );

        cy.get('@row').getBySel('cell-cost').should('exist').should('contain', '₴ 95.00').should('contain', '11.81 км');

        cy.get('@row')
          .getBySel('cell-paymentType')
          .should('exist')
          .find('.mat-icon')
          .should('exist')
          .should('have.attr', 'data-mat-icon-name')
          .and('include', 'cash');

        cy.get('@row').getBySel('cell-productType').should('exist').should('contain', 'Стандарт');

        cy.get('@row').getBySel('cell-status').should('exist').should('contain', 'Виконано');

        cy.get('@row').getBySel('cell-status').getBySel('status-icon-completed').should('exist');
      });
    });
  });
});
