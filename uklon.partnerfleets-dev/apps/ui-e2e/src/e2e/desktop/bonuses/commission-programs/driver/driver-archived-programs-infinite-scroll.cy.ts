import { CommissionProgramType } from '@constant';

import { BrandingCalculationPeriodsOldInterceptor } from '../../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculation-periods-old';
import { BrandingCalculationsProgramOldInterceptor } from '../../../../../support/interceptor/bonuses/branding-bonus-old/branding-calculations-program-old';
import { BrandingBonusProgramsListOldIntercept } from '../../../../../support/interceptor/bonuses/branding-bonus-old/list';
import { CommissionProgramsListIntercept } from '../../../../../support/interceptor/bonuses/commission-programs/list';
import { FleetDriverListIntercept } from '../../../../../support/interceptor/drivers';
import { FleetWalletIntercept } from '../../../../../support/interceptor/finance/fleet-wallet';
import { FleetVehiclesListIntercept } from '../../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../../support/utils';

if (isMockingData()) {
  describe('Driver commission programs - archived programs infinite scroll', () => {
    const drivers = new FleetDriverListIntercept('*');
    const fleetVehiclesListIntercept = new FleetVehiclesListIntercept('*', '*');
    const fleetWalletIntercept = new FleetWalletIntercept();
    const brandingCalculationPeriods = new BrandingCalculationPeriodsOldInterceptor();
    const brandingBonusProgramsListOldIntercept = new BrandingBonusProgramsListOldIntercept('*');
    const brandingCalculationsProgramOldInterceptor = new BrandingCalculationsProgramOldInterceptor();
    const archivedPrograms = new CommissionProgramsListIntercept('drivers', CommissionProgramType.ARCHIVED);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      fleetVehiclesListIntercept.apply({ name: 'ok' });
      fleetWalletIntercept.apply({ name: 'ok' });
      brandingCalculationPeriods.apply({ name: 'ok' });
      brandingBonusProgramsListOldIntercept.apply({ name: 'ok' });
      brandingCalculationsProgramOldInterceptor.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('commissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('commission-tab').click();
      cy.getBySel('commission-tab-archived').should('exist').click();
    });

    describe('When load first page', () => {
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
        archivedPrograms.apply({ name: 'ok', props: { count: 23, has_more_items: false } }).as('getProgramsPage2');
        cy.getBySel('loading-indicator').should('be.visible');
        cy.wait('@getProgramsPage2');
        cy.getBySel('archived-program-item').should('have.length', 53);
      });
    });
  });
}
