describe('Vehicle-list', () => {
  const paginationSize = Cypress.env('paginationSize');

  beforeEach(() => {
    cy.login();
    cy.visit('workspace/vehicles');
  });

  afterEach(() => {
    cy.getBySel('mobile-menu-toggle-btn').should('exist').click();
    cy.getBySel('side-nav').should('exist');
    cy.logout();
  });

  it.skip('[PF-1398] should open vehicle page', () => {
    cy.url().should('includes', '/workspace/vehicles');
  });

  describe('When open vehicle page', () => {
    it.skip('[PF-1399] should have a list tab', () => {
      cy.get('[data-cy="vehicle-tabs-list"]').should('contain', 'Список авто');
    });

    it.skip('[PF-1400] a vehicle list tab should be active', () => {
      cy.get('[role="tab"]').should('have.class', 'mdc-tab--active');
    });

    it.skip('[PF-1401] should have tickets tab', () => {
      cy.get('[data-cy="vehicle-tabs-tickets"]').should('contain', 'Заявки на підключення');
    });
  });

  describe('When navigate between tabs', () => {
    it.skip('[PF-1402] should set ticket tab active', () => {
      cy.get('[data-cy="vehicle-tabs-tickets"]').click();

      cy.get('.mdc-tab-indicator--active [data-cy="vehicle-tabs-tickets"]').should('contain', 'Заявки на підключення');
    });

    it.skip('[PF-1403] should set list tab active', () => {
      cy.get('[data-cy="vehicle-tabs-tickets"]').click();
      cy.get('[data-cy="vehicle-tabs-list"]').click();

      cy.get('.mdc-tab-indicator--active [data-cy="vehicle-tabs-list"]').should('contain', 'Список авто');
    });
  });

  describe('When using the list', () => {
    beforeEach(() => {
      cy.get('[data-cy="vehicle-list"]').as('host');
      cy.get('@host').find('[data-cy="table"]').as('table');
    });

    it.skip('[PF-1404] should show the list', () => {
      cy.get('@table').should('exist');
    });

    describe('list header', () => {
      beforeEach(() => {
        cy.get('@table').find('[data-cy="header-row"]').as('headerRow');
        cy.get('@headerRow').find('[data-cy="header-cell-LicencePlate"]').as('licencePlateHeaderCell');
        cy.get('@headerRow').find('[data-cy="header-cell-Vehicle"]').as('vehicleHeaderCell');
        cy.get('@headerRow').find('[data-cy="header-cell-Branding"]').as('brandingHeaderCell');
        cy.get('@headerRow').find('[data-cy="header-cell-VehicleClass"]').as('vehicleClassHeaderCell');
        cy.get('@headerRow').find('[data-cy="header-cell-Driver"]').as('driverHeaderCell');
        cy.get('@headerRow').find('[data-cy="header-cell-Availability"]').as('availabilityHeaderCell');
      });

      it.skip('[PF-1405] should have a header', () => {
        cy.get('@headerRow').should('exist');
      });

      it.skip('[PF-1406] should have a licence plate column', () => {
        cy.get('@licencePlateHeaderCell').should('contain.text', 'Держ. номер');
      });

      it.skip('[PF-1407] should have a vehicle column', () => {
        cy.get('@vehicleHeaderCell').should('contain.text', 'Автомобіль');
      });

      it.skip('[PF-1408] should have a brand column', () => {
        cy.get('@brandingHeaderCell').should('contain.text', 'Брендування');
      });

      it.skip('[PF-1409] should have a product types column', () => {
        cy.get('@vehicleClassHeaderCell').should('contain.text', 'Комфорт клас');
      });

      it.skip('[PF-1410] should have a driver column', () => {
        cy.get('@driverHeaderCell').should('contain.text', 'Водій');
      });

      it.skip('[PF-1411] should have a availability column', () => {
        cy.get('@availabilityHeaderCell').should('contain.text', 'Доступність');
      });
    });

    describe('first row', () => {
      beforeEach(() => {
        cy.get('@table').find('[data-cy="row-0"]').as('row');
        cy.get('@row').find('[data-cy="cell-LicencePlate"]').as('licencePlateCell');
        cy.get('@row').find('[data-cy="cell-Vehicle"]').as('vehicleCell');
        cy.get('@vehicleCell').find('[data-cy="vehicle-maker"]').as('vehicleCellMaker');
        cy.get('@vehicleCell').find('[data-cy="vehicle-properties"]').as('vehicleCellProperties');
      });

      it.skip('[PF-1412] licence plate cell should contain AQA7297', () => {
        cy.get('@licencePlateCell').should('contain.text', 'AQA7297');
      });

      it.skip('[PF-1413] should first row vehicle contains Cadillac XTS', () => {
        cy.get('@vehicleCellMaker').should('contain.text', 'Cadillac XTS');
      });

      it.skip('[PF-1414] should first row vehicle contains year/color info', () => {
        cy.get('@vehicleCellProperties').should('contain.text', 'Білий • 2017');
      });
    });

    describe('when has vehicles', () => {
      beforeEach(() => {
        cy.get('@table').get('[data-cy^="row-"]').as('rows');
      });

      it.skip('[PF-1415] should have 30 vehicles', () => {
        cy.get('@rows').should('have.length', paginationSize);
      });
    });

    describe('pagination', () => {
      beforeEach(() => {
        cy.get('@host').find('[data-cy="mat-paginator"]').as('paginator');
      });

      it.skip('[PF-1416] should have paginator', () => {
        cy.get('@paginator').should('exist');
      });

      it.skip('[PF-1417] should show range of displayed rows', () => {
        cy.get('@paginator').should('contain.text', `1 - ${paginationSize} з 40`);
      });
    });
  });
});
