describe.skip('Driver details statistic tab', () => {
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

  describe.skip('Driver statistics', () => {
    it.skip('[PF-1169] should should have active class for stats tab', () => {
      cy.get('.mdc-tab-indicator--active')
        .getBySel('driver-details-tabs-statistic')
        .should('contain', 'Статистика роботи');
    });

    it.skip('[PF-1170] should have empty state if no statistics is avaliable', () => {
      cy.getBySel('no-data').should('exist');
    });

    it("[PF-1171] should display driver's statistics", () => {
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('driver-statistics').should('exist');
    });

    it("[PF-1172] should display driver's rating", () => {
      cy.useDateRangeFilter('custom', '01.08.2023', '31.08.2023');
      cy.getBySel('rating-card').should('exist').get('.employee-info-item-value').should('contain', '—');
    });

    it("[PF-1173] should display driver's completed orders count", () => {
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('orders-card').should('exist').get('.employee-info-item-value').should('contain', '—');
    });

    it("[PF-1174] should display driver's canceled orders count", () => {
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('cancelation-card').should('exist').get('.employee-info-item-value').should('contain', '—');
    });

    it("[PF-1175] should display driver's distance driven", () => {
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('distance-card').should('exist').get('.employee-info-item-value').should('contain', '11.0 км');
    });

    it.skip('[PF-1176] should display deatailed income statistics', () => {
      cy.useDateRangeFilter('custom', '01.05.2023', '31.05.2023');
      cy.getBySel('income-for-period').find('span').should('contain', '₴ 95.00');
      cy.getBySel('total-income').find('span').should('contain', '₴ 95.00');
      cy.getBySel('income-pie-chart').should('exist');
      cy.getBySel('fees-panel').should('exist');
      cy.getBySel('tips-panel').should('exist');
    });

    describe('Driver statistics filter', () => {
      it("[PF-1177] should not display reset button if filter didn't change", () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
      });

      it.skip('[PF-1178] should display reset button if filter has changed', () => {
        cy.useDateRangeFilter('today');
        cy.getBySel('filter-reset-btn').should('exist');
      });

      it.skip('[PF-1179] should reset filter to default value on reset button click', () => {
        cy.useDateRangeFilter('today');
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.getBySel('date-range-select').get('.mat-mdc-select-value').should('contain', 'Поточний тиждень');
      });

      it.skip('[PF-1180] should have default filter value set to Current week', () => {
        cy.getBySel('date-range-select').get('.mat-mdc-select-value').should('contain', 'Поточний тиждень');
      });

      it.skip('[PF-1181] should have 9 options', () => {
        cy.getBySel('date-range-select').click();
        cy.getBySelLike('date-range-option').should('have.length', 9);
        cy.getBySelLike('date-range-option').eq(2).click();
      });
    });
  });
});
