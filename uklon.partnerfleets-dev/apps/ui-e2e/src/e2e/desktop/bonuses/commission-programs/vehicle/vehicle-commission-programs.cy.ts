import { CommissionProgramType } from '@constant';

import { CommissionProgramsListIntercept } from '../../../../../support/interceptor/bonuses/commission-programs/list';
import { FleetDriverListIntercept } from '../../../../../support/interceptor/drivers';
import { isMockingData } from '../../../../../support/utils';

if (isMockingData()) {
  describe('Vehicle active programs - load data', () => {
    const drivers = new FleetDriverListIntercept('*');
    const activePrograms = new CommissionProgramsListIntercept('vehicles', CommissionProgramType.ACTIVE);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('vehicleActiveCommissionProgramsLoadData');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('vehicle-commission-tab').click();
    });

    describe('should load vehicle active programs', () => {
      beforeEach(() => {
        activePrograms.apply({ name: 'ok', props: { count: 30, has_more_items: true } }).as('getProgramsPage1');
      });

      it('should load first page', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('active-commission-programs-list').should('be.visible');
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('active-program-item').should('have.length', 30);
      });

      it('should load second page when scroll', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('active-commission-programs-list').should('be.visible');
        cy.getBySel('active-program-item').should('have.length', 30);
        cy.getBySel('bonuses-tab-infinite-scroll-wrap').scrollTo('bottom');
        activePrograms.apply({ name: 'ok', props: { count: 15, has_more_items: false } }).as('getProgramsPage2');
        cy.getBySel('loading-indicator').should('be.visible');
        cy.wait('@getProgramsPage2');
        cy.getBySel('active-program-item').should('have.length', 45);
      });
    });
  });

  describe('Vehicle planned programs - load data', () => {
    const drivers = new FleetDriverListIntercept('*');
    const plannedPrograms = new CommissionProgramsListIntercept('vehicles', CommissionProgramType.PLANNED);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('vehiclePlannedCommissionProgramsLoadData');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('vehicle-commission-tab').click();
      cy.getBySel('commission-tab-planned').should('exist').click();
    });

    describe('should load vehicle planned programs', () => {
      beforeEach(() => {
        plannedPrograms.apply({ name: 'ok', props: { count: 30, has_more_items: true } }).as('getProgramsPage1');
      });

      it('should load first page', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('planned-commission-programs-list').should('be.visible');
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('planned-program-item').should('have.length', 30);
      });

      it('should load second page when scroll', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('planned-commission-programs-list').should('be.visible');
        cy.getBySel('planned-program-item').should('have.length', 30);
        cy.getBySel('bonuses-tab-infinite-scroll-wrap').scrollTo('bottom');
        plannedPrograms.apply({ name: 'ok', props: { count: 15, has_more_items: false } }).as('getProgramsPage2');
        cy.getBySel('loading-indicator').should('be.visible');
        cy.wait('@getProgramsPage2');
        cy.getBySel('planned-program-item').should('have.length', 45);
      });
    });
  });

  describe('Vehicle archived programs - load data', () => {
    const drivers = new FleetDriverListIntercept('*');
    const archivedPrograms = new CommissionProgramsListIntercept('vehicles', CommissionProgramType.ARCHIVED);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('vehicleArchivedCommissionProgramsLoadData');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('vehicle-commission-tab').click();
      cy.getBySel('commission-tab-archived').should('exist').click();
    });

    describe('should load vehicle archived programs', () => {
      beforeEach(() => {
        archivedPrograms.apply({ name: 'ok', props: { count: 30, has_more_items: true } }).as('getProgramsPage1');
      });

      it('should load first page', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('archived-commission-programs-list').should('be.visible');
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('archived-program-item').should('have.length', 30);
      });

      it('should load second page when scroll', () => {
        cy.wait('@getProgramsPage1');
        cy.getBySel('archived-commission-programs-list').should('be.visible');
        cy.getBySel('archived-program-item').should('have.length', 30);
        cy.getBySel('bonuses-tab-infinite-scroll-wrap').scrollTo('bottom');
        archivedPrograms.apply({ name: 'ok', props: { count: 15, has_more_items: false } }).as('getProgramsPage2');
        cy.getBySel('loading-indicator').should('be.visible');
        cy.wait('@getProgramsPage2');
        cy.getBySel('archived-program-item').should('have.length', 45);
      });
    });
  });
}
