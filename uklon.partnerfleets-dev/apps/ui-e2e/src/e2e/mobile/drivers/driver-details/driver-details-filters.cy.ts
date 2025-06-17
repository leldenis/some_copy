describe.skip('Driver details filters', () => {
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

  describe('Driver filters', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-expandedFilters').should('exist').click();
    });

    it.skip('[PF-1218] should should have active class for filters tab', () => {
      cy.get('.mdc-tab-indicator--active')
        .getBySel('driver-details-tabs-expandedFilters')
        .should('contain', 'Розширені фільтри');
    });

    it.skip('[PF-1219] should have order types and additional options blocks', () => {
      cy.getBySel('order-types').should('exist');
      cy.getBySel('additional-options').should('exist');
    });

    it.skip('[PF-1220] should have Save button disabled by default', () => {
      cy.getBySel('filters-save-btn').should('exist').should('be.disabled');
    });

    it.skip('[PF-1221] should have available/not-available filters toggle', () => {
      cy.getBySel('available-filters').should('exist').should('be.enabled');
      cy.getBySel('not-available-filters').should('exist').should('be.enabled');
    });

    describe.skip('Available filters', () => {
      it.skip('[PF-1222] should have 6 filters available', () => {
        cy.getBySel('filter-option').should('exist').should('have.length', 6);
      });

      it.skip('[PF-1223] should toggle filters', () => {
        for (let i = 0; i < 6; i += 1) {
          cy.getBySel('filter-option').eq(i).should('exist').find('.mat-mdc-slide-toggle').as('toggle');
          cy.get('@toggle').click();
          cy.get('@toggle').should('not.have.class', 'mat-mdc-slide-toggle-checked');
          cy.get('@toggle').click();
          cy.get('@toggle').should('have.class', 'mat-mdc-slide-toggle-checked');
        }
      });

      it.skip('[PF-1224] should enable Save button if filter change', () => {
        cy.getBySel('filter-option').eq(0).should('exist').find('.mat-mdc-slide-toggle').as('toggle');
        cy.get('@toggle').click();
        cy.getBySel('filters-save-btn').should('exist').should('be.enabled');
      });

      it("[PF-1225] should keep Save button disabled if filters don't change after toggling", () => {
        cy.getBySel('filter-option').eq(0).should('exist').find('.mat-mdc-slide-toggle').as('toggle');
        cy.get('@toggle').click();
        cy.get('@toggle').click();
        cy.getBySel('filters-save-btn').should('exist').should('be.disabled');
      });

      it.skip('[PF-1226] should open product configuration', () => {
        cy.getBySel('filter-option').eq(0).should('exist').click();
        cy.getBySel('product-configuration').should('exist');
        cy.getBySel('close-product-config-btn').should('exist').click();
      });
    });

    describe('Not available filters', () => {
      beforeEach(() => {
        cy.getBySel('not-available-filters').should('exist').click();
      });

      it.skip('[PF-1227] should have 8 not available filters', () => {
        cy.getBySel('filter-option').should('exist').should('have.length', 8);
      });

      it.skip('[PF-1228] should have Blocked status badge', () => {
        cy.getBySel('filter-option')
          .eq(5)
          .should('exist')
          .getBySel('blocked-badge')
          .should('exist')
          .should('contain', 'Заблоковано');
      });

      it.skip('[PF-1229] should open product configuration', () => {
        cy.getBySel('filter-option').eq(0).should('exist').click();
        cy.getBySel('product-configuration').should('exist');
        cy.getBySel('close-product-config-btn').should('exist').click();
      });
    });

    describe.skip('Additional options', () => {
      it.skip('[PF-1230] should have enabled/disabled ride conditions blocks', () => {
        cy.getBySel('enabled-ride-conditions').should('exist');
        cy.getBySel('disabled-ride-conditions').should('exist');
      });

      it.skip('[PF-1231] should have no enabled conditions', () => {
        cy.getBySel('enabled-ride-conditions').should('exist').should('contain', 'Немає даних для відображення');
      });

      it.skip('[PF-1232] should have disabled conditions', () => {
        cy.getBySel('disabled-ride-conditions')
          .should('exist')
          .getBySel('condition-badge')
          .should('exist')
          .should('have.length', 1)
          .should('contain', 'Допомога з завантаженням вантажу');
      });
    });
  });
});
