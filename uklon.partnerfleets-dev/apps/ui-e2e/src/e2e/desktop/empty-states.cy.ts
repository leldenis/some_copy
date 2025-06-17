import { AccountKind, getAccountByKind } from '../../support/utils';

describe.skip('When no data on a fleet', () => {
  const emptyAccount = getAccountByKind(AccountKind.EMPTY);

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginWithSession(emptyAccount.username, emptyAccount.username, emptyAccount.password);
    cy.visit('/');
    cy.url().should('includes', '/workspace/general');
    cy.get('[data-cy="menu-toggle-btn"]').should('exist').click();
  });

  describe('When no drivers in a fleet', () => {
    it('[C462971] Should display empty state', () => {
      cy.get('[data-cy="side-nav-menu-drivers"]').click();
      cy.url().should('includes', 'workspace/drivers');

      cy.get('[role="tab"]')
        .should('exist')
        .should('have.length', 2)
        .eq(0)
        .should('have.class', 'mdc-tab--active')
        .find('.mdc-tab__content:first')
        .should('exist')
        .should('contain', 'Список водіїв');

      // eslint-disable-next-line cypress/unsafe-to-chain-command
      cy.get('[role="tab"]')
        .eq(1)
        .click()
        .find('.mdc-tab__content:first')
        .should('exist')
        .should('contain', 'Заявки на підключення');

      cy.get('[data-cy="no-data"]').should('exist');
    });
  });

  describe('When no vehicles found', () => {
    it('[C386374] should display empty table', () => {
      cy.get('[data-cy="side-nav-menu-vehicles"]').click();
      cy.url().should('includes', '/workspace/vehicles');

      cy.get('[data-cy="vehicle-tabs-list"]').should('exist').should('contain', 'Список авто');

      cy.get('[data-cy="vehicle-tabs-tickets"]').should('exist').should('contain', 'Заявки на підключення');

      cy.get('[data-cy="no-data"]').should('exist');
    });
  });
});
