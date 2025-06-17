import { UklonGarageApplicationsIntercept } from '../../../support/interceptor';
import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/drivers/photo-control/has-active-tickets';
import { isMockingData } from '../../../support/utils';

const garageIntercept = new UklonGarageApplicationsIntercept('*');
const hasActiveTickets = new DriverPhotoControlHasActiveTicketsIntercept('*');

describe('Drivers list filter', () => {
  beforeEach(() => {
    if (isMockingData()) {
      garageIntercept.apply({ name: 'ok' });
      hasActiveTickets.apply({ name: 'ok' });
      fleetDriverListIntercept.apply({ name: 'ok' });
    }

    cy.clearLocalStorage();
    cy.loginWithSession('DriverListFilter');
    cy.visit('/');

    cy.getBySel('menu-toggle-btn').click();
    cy.getBySel('side-nav-menu-drivers').click();
  });

  describe('When search drivers by', () => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const getTableRows = () => cy.getBySel('table').getBySelLike('row-');
    describe('Name', () => {
      describe('when filtering', () => {
        const testAccount = { name: 'Aqax', resultLength: 6 };

        beforeEach(() => {
          cy.getBySel('filter-Name').type(testAccount.name);

          if (isMockingData()) {
            fleetDriverListIntercept.apply({ name: 'ok', props: { count: testAccount.resultLength } });
          }
        });

        it('[5072] should show 6 results', () => {
          getTableRows().should('have.length', testAccount.resultLength);
        });
      });
    });

    if (isMockingData()) {
      describe('Phone', () => {
        it('[PF-231] should have a placeholder', () => {
          const expected = 'Номер телефону';
          // eslint-disable-next-line cypress/unsafe-to-chain-command
          cy.getBySel('filter-Phone').focus().invoke('attr', 'placeholder').should('contain', expected);
        });

        describe('when filtering', () => {
          beforeEach(() => {
            cy.getBySel('filter-Phone').type('576019921860');

            if (isMockingData()) {
              fleetDriverListIntercept.apply({ name: 'ok', props: { count: 1 } });
            }
          });

          it('[PF-232] should find a single driver', () => {
            getTableRows().should('have.length', 1);
          });
        });

        describe('when phone number not exact', () => {
          beforeEach(() => {
            cy.getBySel('filter-Phone').type('576019921860');

            if (isMockingData()) {
              fleetDriverListIntercept.apply({ name: 'ok', props: { count: 1 } });
            }
          });

          it('[PF-233] should not filter', () => {
            cy.getBySel('filter-Phone').type('57601992');
            getTableRows().should('have.length', 1);
          });
        });
      });

      describe('when reset filter', () => {
        beforeEach(() => {
          cy.getBySel('filter-Name').type('asdjnrw');
        });

        it('[PF-229] Should reset filter on clear button pressed', () => {
          cy.getBySel('filter-reset-btn').should('exist').click();
        });
      });
    }
  });
});
