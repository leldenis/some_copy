import { FleetDriverDto } from '@data-access';

const { _ } = Cypress;

describe('Drivers list', () => {
  const paginationSize = Cypress.env('paginationSize');
  let driverDetails: FleetDriverDto;

  before(() => {
    cy.fixture('drivers/details/driver-details-0.json').then((driverDetailsDto: FleetDriverDto) => {
      driverDetails = driverDetailsDto;
    });
  });

  beforeEach(() => {
    cy.loginWithSession('DriverList');
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

  describe.skip('When a fleet has drivers', () => {
    beforeEach(() => {
      cy.getBySel('driver-list').as('host');
      cy.get('@host').find('[data-cy="table"]').as('table');
      cy.get('@table').find('[data-cy^="row-"]').as('rows');
      cy.get('@host').find('[data-cy="mat-paginator"]').as('paginator');
    });

    it.skip('[PF-1151] should navigate to driver list', () => {
      cy.url().should('includes', 'workspace/drivers');
    });

    it.skip('[PF-1152] should not be empty', () => {
      cy.get('[data-cy="no-data"]').should('not.exist');
    });

    it(`[PF-1153] should have ${paginationSize} records per page`, () => {
      cy.get('@rows').should('have.length', paginationSize);
    });

    it.skip('[PF-1154] drivers should be sorted by full name', () => {
      cy.get('@paginator').contains(`1 - ${paginationSize} з 49`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
      const toStrings = (cells: any) => _.map(cells, 'textContent');
      cy.get('@table')
        .find('[data-cy="cell-FullName"]')
        .then(toStrings)
        .then((fullNames) => {
          const sorted = _.sortBy(fullNames);
          expect(fullNames, 'table is sorted by full name').to.deep.equal(sorted);
        });
    });

    describe('header row', () => {
      beforeEach(() => {
        cy.get('@table').find('[data-cy="header-row"]').as('headerRow');
      });

      it.skip('[PF-1155] should have a header', () => {
        cy.get('@headerRow').should('exist');
      });

      describe('header cells', () => {
        beforeEach(() => {
          cy.get('@headerRow').find('[data-cy="header-cell-FullName"]').as('headerCellFullName');
          cy.get('@headerRow').find('[data-cy="header-cell-Phone"]').as('headerCellPhone');
          cy.get('@headerRow').find('[data-cy="header-cell-Signal"]').as('headerCellSignal');
          cy.get('@headerRow').find('[data-cy="header-cell-Rating"]').as('headerCellRating');
          cy.get('@headerRow').find('[data-cy="header-cell-Karma"]').as('headerCellKarma');
          cy.get('@headerRow').find('[data-cy="header-cell-Vehicle"]').as('headerCellVehicle');
        });

        it.skip('[PF-1156] should have a full name cell', () => {
          cy.get('@headerCellFullName').should('contain.text', "Прізвище та ім'я");
        });

        it.skip('[PF-1157] should have a phone cell', () => {
          cy.get('@headerCellPhone').should('contain.text', 'Номер телефону');
        });

        it.skip('[PF-1158] should have a signal cell', () => {
          cy.get('@headerCellSignal').should('contain.text', 'Позивний');
        });

        it.skip('[PF-1159] should have a rating cell', () => {
          cy.get('@headerCellRating').should('contain.text', 'Рейтинг');
        });

        it.skip('[PF-1160] should have a karma cell', () => {
          cy.get('@headerCellKarma').should('contain.text', 'Uklon карма');
        });

        it.skip('[PF-1161] should have a vehicle cell', () => {
          cy.get('@headerCellVehicle').should('contain.text', 'На авто');
        });
      });
    });

    describe('first row', () => {
      beforeEach(() => {
        cy.get('@rows').first().as('row');
      });

      it.skip('[PF-1162] should have a row', () => {
        cy.get('@row').should('exist');
      });

      describe('cells', () => {
        beforeEach(() => {
          cy.get('@row').find('[data-cy="cell-FullName"]').as('cell-FullName');
          cy.get('@row').find('[data-cy="cell-Phone"]').as('cell-Phone');
          cy.get('@row').find('[data-cy="cell-Signal"]').as('cell-Signal');
          cy.get('@row').find('[data-cy="cell-Rating"]').as('cell-Rating');
          cy.get('@row').find('[data-cy="cell-Karma"]').as('cell-Karma');
        });

        it.skip('[PF-1163] should have a full name cell', () => {
          cy.get('@cell-FullName').should('contain.text', `${driverDetails.last_name} ${driverDetails.first_name}`);
        });

        it.skip('[PF-1164] should have a phone cell', () => {
          cy.get('@cell-Phone').should('contain.text', driverDetails.phone);
        });

        it.skip('[PF-1165] should have a signal cell', () => {
          cy.get('@cell-Signal').should('contain.text', driverDetails.signal);
        });

        it.skip('[PF-1166] should have a rating cell', () => {
          const expected = (driverDetails.rating / 100).toFixed(2);
          cy.get('@cell-Rating').should('contain.text', expected);
        });

        it.skip('[PF-1167] should have a karma cell', () => {
          cy.get('@cell-Karma').should('contain.text', `${driverDetails.karma.value}%`);
        });
      });
    });
  });
});
