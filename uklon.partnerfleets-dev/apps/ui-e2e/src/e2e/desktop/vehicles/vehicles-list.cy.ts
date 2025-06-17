import { FleetVehiclesListIntercept } from '../../../support/interceptor/vehicles/list';
import { vehiclePhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/vehicles/photo-control-has-active-tickets';
import { FleetVehiclesTicketsListIntercept } from '../../../support/interceptor/vehicles/tickets-list';
import { isMockingData } from '../../../support/utils';

describe('Vehicle-list', () => {
  const paginationSize = Cypress.env('paginationSize');
  const fleetVehiclesList = new FleetVehiclesListIntercept('*', 'offset=0&limit=30');
  const ticketsList = new FleetVehiclesTicketsListIntercept('*', '*');

  beforeEach(() => {
    if (isMockingData()) {
      fleetVehiclesList.apply({ name: 'ok', props: { count: 30, total: 40 } });
      ticketsList.apply({ name: 'ok', props: { items: [] } });
      vehiclePhotoControlHasActiveTicketsIntercept.apply({ name: 'ok' });
    }
    cy.loginWithSession('vehicleList');
    cy.visit('/');
    cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
    cy.getBySel('side-nav-menu-vehicles').click();
  });
  if (isMockingData()) {
    describe('When open vehicle page', () => {
      it('[PF-1007] should open vehicle page', () => {
        cy.url().should('includes', '/workspace/vehicles');
      });

      it('[PF-1008] should have a list tab', () => {
        cy.get('[data-cy="vehicle-tabs-list"]').should('contain', 'Список авто');
      });

      it('[PF-1009] a vehicle list tab should be active', () => {
        cy.get('[role="tab"]').should('have.class', 'mdc-tab--active');
      });

      it('[PF-1010] should have tickets tab', () => {
        cy.get('[data-cy="vehicle-tabs-tickets"]').should('contain', 'Заявки на підключення');
      });
    });

    describe('When navigate between tabs', () => {
      it('[PF-1011] should set ticket tab active', () => {
        cy.get('[data-cy="vehicle-tabs-tickets"]').click();

        cy.get('.mdc-tab-indicator--active [data-cy="vehicle-tabs-tickets"]').should(
          'contain',
          'Заявки на підключення',
        );
      });

      it('[PF-1012] should set list tab active', () => {
        cy.get('[data-cy="vehicle-tabs-tickets"]').click();
        cy.get('[data-cy="vehicle-tabs-list"]').click();

        cy.get('.mdc-tab-indicator--active [data-cy="vehicle-tabs-list"]').should('contain', 'Список авто');
      });
    });
  }

  describe('When using the list', () => {
    beforeEach(() => {
      cy.get('[data-cy="vehicle-list"]').as('host');
      cy.get('@host').find('[data-cy="table"]').as('table');
    });

    if (isMockingData()) {
      it('[PF-1013] should show the list', () => {
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

        it('[PF-1014] should have a headers', () => {
          cy.get('@headerRow').should('exist');
        });

        it('[PF-1015] should have a licence plate column', () => {
          cy.get('@licencePlateHeaderCell').should('contain.text', 'Держ. номер');
        });

        it('[PF-1016] should have a vehicle column', () => {
          cy.get('@vehicleHeaderCell').should('contain.text', 'Автомобіль');
        });

        it('[PF-1017] should have a brand column', () => {
          cy.get('@brandingHeaderCell').should('contain.text', 'Брендування');
        });

        it('[PF-1018] should have a product types column', () => {
          cy.get('@vehicleClassHeaderCell').should('contain.text', 'Комфорт клас');
        });

        it('[PF-1019] should have a driver column', () => {
          cy.get('@driverHeaderCell').should('contain.text', 'Водій');
        });

        it('[PF-1020] should have a availability column', () => {
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

        it('[PF-1021] should contain licence plate', () => {
          cy.get('@licencePlateCell').should('contain.text', 'AQA7297');
        });

        it('[PF-1022] should contain vehicle model', () => {
          cy.get('@vehicleCellMaker').should('contain.text', 'Cadillac XTS');
        });

        it('[PF-1023] should contains year/color info', () => {
          cy.get('@vehicleCellProperties').should('contain.text', 'Білий • 2017');
        });
      });
    }

    describe('when has vehicles', () => {
      beforeEach(() => {
        cy.get('@table').get('[data-cy^="row-"]').as('rows');
      });

      it('[5040] should have 30 vehicles', () => {
        cy.get('@rows').should('have.length', paginationSize);
      });
    });

    if (isMockingData()) {
      describe('pagination', () => {
        beforeEach(() => {
          cy.get('@host').find('[data-cy="mat-paginator"]').as('paginator');
        });

        it('[PF-1025] should have paginator', () => {
          cy.get('@paginator').should('exist');
        });

        it('[PF-1026] should show range of displayed rows', () => {
          cy.get('@paginator').should('contain.text', `1 - ${paginationSize} з 40`);
        });
      });
    }
  });
});
