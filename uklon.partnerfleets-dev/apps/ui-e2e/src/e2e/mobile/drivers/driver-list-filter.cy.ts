describe('Drivers list filter', () => {
  const paginationSize = Cypress.env('paginationSize');

  beforeEach(() => {
    cy.loginWithSession('DriverListFilter');
    cy.visit('/');
    cy.getBySel('mobile-menu-toggle-btn').as('menu').should('exist');
    cy.getBySel('side-nav-menu-drivers').as('link').should('exist');
    cy.getBySel('logout').as('logout').should('exist');

    cy.get('@menu').click();
    cy.get('@link').click();
  });

  afterEach(() => {
    cy.get('@menu').click();
    cy.get('@logout').click();
  });

  describe('When search drivers by', () => {
    beforeEach(() => {
      cy.get('[data-cy="drivers-host"]').as('host');
      cy.get('@host').find('[data-cy="filter"]').as('filter');
      cy.get('@host').find('[data-cy="table"]').as('table');
      cy.get('@table').find('[data-cy^="row-"]').as('rows');
    });

    describe('when reset filter', () => {
      beforeEach(() => {
        cy.get('@filter').find('[data-cy="filter-Name"]').type('asdjnrw');
      });

      it.skip('[PF-1136] Should reset filter on clear button pressed', () => {
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.get('@rows').should('have.length', paginationSize);
      });
    });

    describe('Name', () => {
      beforeEach(() => {
        cy.get('@filter').find('[data-cy="filter-Name"]').as('name');
      });

      describe('when filtering', () => {
        beforeEach(() => {
          cy.get('@name').type('Aqax');
        });

        it.skip('[PF-1137] should show 6 results', () => {
          cy.get('@rows').should('have.length', 6);
        });
      });
    });

    describe('Phone', () => {
      beforeEach(() => {
        cy.get('@filter').find('[data-cy="filter-Phone"]').as('phone');
      });

      it.skip('[PF-1138] should have a placeholder', () => {
        const expected = 'Пошук за номером телефону';
        // eslint-disable-next-line cypress/unsafe-to-chain-command
        cy.get('@phone').focus().invoke('attr', 'placeholder').should('contain', expected);
      });

      describe('when filtering', () => {
        beforeEach(() => {
          cy.get('@phone').type('576019921860');
        });

        it.skip('[PF-1139] should find a single driver', () => {
          cy.get('@rows').should('have.length', 1);
        });
      });

      describe('when phone number not exact', () => {
        beforeEach(() => {
          cy.get('@phone').type('57601992');
        });

        it.skip('[PF-1140] should not filter', () => {
          cy.get('@rows').should('have.length', 30);
        });
      });
    });
  });
});
