describe('Vehicle tickets list', () => {
  beforeEach(() => {
    cy.loginWithSession('vehicleTicketsList');
    cy.visit('/');

    cy.getBySel('mobile-menu-toggle-btn').as('menu').should('exist');
    cy.getBySel('side-nav-menu-vehicles').as('link').should('exist');
    cy.getBySel('logout').as('logout').should('exist');

    cy.get('@menu').click();
    cy.get('@link').click();
  });

  afterEach(() => {
    cy.get('@menu').click();
    cy.get('@link').click();
  });

  it.skip('[PF-1418] should have a tickets tab', () => {
    cy.getBySel('vehicle-tabs-tickets').should('exist');
  });

  beforeEach(() => {
    cy.getBySel('vehicle-tabs-tickets').click();
  });

  describe('Vehicle tickets list', () => {
    it.skip('[PF-1419] should display vehicle ticket list', () => {
      cy.getBySel('vehicle-tickets-list').should('exist').should('be.visible');
    });

    it.skip('[PF-1420] should have header row', () => {
      cy.getBySel('vehicle-tickets-header-row').should('exist').should('not.be.visible');
    });

    it.skip('[PF-1421] should have data row', () => {
      cy.getBySel('vehicle-tickets-item-row').should('exist').should('be.visible');
    });

    describe('Data row', () => {
      it.skip('[PF-1422] should have a license plate cell', () => {
        cy.getBySel('td-license-plate').should('be.visible').should('contain', 'BK4200CP');

        cy.getBySel('td-license-plate')
          .find('a')
          .should('exist')
          .should('have.attr', 'href', '/workspace/vehicles/ticket/4cb16359-c049-4c8e-8be8-6043129274d1')
          .should('contain', 'BK4200CP');

        cy.getBySel('td-license-plate-make').should('exist').should('be.visible').should('contain', 'Acura');
      });

      it.skip('[PF-1423] should have a vehicle cell', () => {
        cy.getBySel('td-vehicle').should('exist').should('not.be.visible');
      });

      it.skip('[PF-1424] should have a create at cell', () => {
        cy.getBySel('td-created-at').should('be.visible').should('contain', '18.04.2024').should('contain', 'Черновий');
      });

      describe('if ticket has the status is draft', () => {
        it.skip('[PF-1425] should have a status is draft', () => {
          cy.getBySel('td-status-mobile').should('be.visible').should('contain', 'Черновий');
        });

        it.skip('[PF-1426] should display delete button', () => {
          cy.getBySel('vehicle-ticket-delete-btn-mobile').should('exist').should('be.visible');
        });
      });
    });
  });
});
