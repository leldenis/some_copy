describe('Driver-Tickets-List', () => {
  beforeEach(() => {
    cy.loginWithSession('driverTicketsList');
    cy.visit('/');

    cy.getBySel('mobile-menu-toggle-btn').as('menu').should('exist');
    cy.getBySel('side-nav-menu-drivers').as('link').should('exist');
    cy.getBySel('logout').as('logout').should('exist');

    cy.get('@menu').click();
    cy.get('@link').click();
  });

  afterEach(() => {
    cy.get('@menu').click();
    cy.get('@link').click();
  });

  it.skip('[PF-1243] should have a Tickets tab', () => {
    cy.getBySel('tab-label-DriversTickets').should('exist');
  });

  beforeEach(() => {
    cy.getBySel('tab-label-DriversTickets').click();
  });

  describe('When using tickets list', () => {
    it.skip('[PF-1245] header should not be visible', () => {
      cy.getBySel('header-row').should('exist').should('not.be.visible');
    });

    it.skip('[PF-1246] should have a name column', () => {
      cy.getBySel('header-cell-Name').should('exist');
    });

    it.skip('[PF-1247] should have a phone column', () => {
      cy.getBySel('header-cell-Phone').should('exist');
    });

    it.skip('[PF-1248] should have a date column', () => {
      cy.getBySel('header-cell-Date').should('exist');
    });

    it.skip('[PF-1249] should have a status column', () => {
      cy.getBySel('header-cell-Status').should('exist');
    });
  });

  it.skip('[PF-1244] should filter by phone', () => {
    cy.getBySel('driver-ticket-filter-Phone').type('576019222837');
    cy.getBySel('cell-Phone').should('contain', '576019222837');
  });

  describe('When using status filter', () => {
    beforeEach(() => {
      cy.getBySel('drivers-ticket-filter-Status').click();
    });

    it.skip('[PF-1250] should open status selector', () => {
      cy.getBySel('drivers-tickets-Status').should('be.visible');
      cy.get('#mat-option-1').click();
    });

    it.skip('[PF-1251] should filter by status', () => {
      cy.get('#mat-option-1').click();
    });
  });
});
