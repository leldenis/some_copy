describe.skip('Driver details settings tab', () => {
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

  describe.skip('Driver accessibility settings', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-access').should('exist').click();
      cy.getBySel('access-all-cars-radio').find('.mdc-label').as('allCars');
      cy.getBySel('access-specific-drivers-radio').find('.mdc-label').as('specificDrivers');
      cy.getBySel('access-nobody-radio').find('.mdc-label').as('nobody');
    });

    it.skip('[PF-1182] should should have active class for accessibility tab', () => {
      cy.get('.mdc-tab-indicator--active').getBySel('driver-details-tabs-access').should('contain', 'Доступ');
    });

    it.skip('[PF-1183] should have 3 accessibility options', () => {
      cy.get('@allCars').should('exist');
      cy.get('@specificDrivers').should('exist');
      cy.get('@nobody').should('exist');
    });

    it.skip('[PF-1184] should have Nobody option disabled, if driver has active connection with vehicle', () => {
      cy.getBySel('access-nobody-radio').find('input[type="radio"]').should('be.disabled');
    });

    it("[PF-1185] should have Nobody option enabled if driver doesn't have connected vehicle", () => {
      cy.visit('/workspace/drivers/details/c19c7e33-7da7-400a-b64a-967ae4f532a5');
      cy.getBySel('driver-details-tabs-access').should('exist').click();
      cy.getBySel('access-nobody-radio').find('input[type="radio"]').should('be.enabled');
    });

    describe('Specific drivers accessibility option', () => {
      beforeEach(() => {
        cy.get('@specificDrivers').click();
      });

      it.skip('[PF-1186] should display display vehicles autocomplete', () => {
        cy.getBySel('vehicles-accessibility-autocomplete').should('exist');
      });

      it("[PF-1187] should have current driver's vehicle, as first option selected in autocomplete", () => {
        cy.getBySel('vehicles-accessibility-autocomplete').find('.mat-mdc-chip').should('contain', 'AQA0001');
      });

      it("[PF-1188] should not be possible to remove connected driver's vehicle", () => {
        cy.getBySel('vehicles-accessibility-autocomplete')
          .find('.mat-mdc-chip')
          .find('.mat-mdc-chip-remove')
          .should('not.exist');
      });

      it.skip('[PF-1189] should add new accessible vehicle', () => {
        cy.getBySel('vehicles-accessibility-autocomplete')
          .getBySel('vehicles-accessibility-autocomplete-input')
          .click();
        cy.get('.mat-mdc-option').eq(0).click();
        cy.getBySel('vehicles-accessibility-autocomplete')
          .find('.mat-mdc-chip')
          .should('have.length', 2)
          .eq(1)
          .should('contain', 'AQA7297');
      });

      it.skip('[PF-1190] should be able to delete vehicle from accessability list', () => {
        cy.getBySel('vehicles-accessibility-autocomplete')
          .getBySel('vehicles-accessibility-autocomplete-input')
          .click();
        cy.get('.mat-mdc-option').eq(0).click();
        cy.getBySel('vehicles-accessibility-autocomplete')
          .find('.mat-mdc-chip')
          .should('have.length', 2)
          .eq(1)
          .should('contain', 'AQA7297');
        cy.getBySel('vehicles-accessibility-autocomplete')
          .find('.mat-mdc-chip')
          .eq(1)
          .find('.mat-mdc-chip-remove')
          .should('exist')
          .click();
        cy.getBySel('vehicles-accessibility-autocomplete').find('.mat-mdc-chip').should('have.length', 1);
      });
    });
  });
});
