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
  describe('Driver commission programs - planned programs', () => {
    const drivers = new FleetDriverListIntercept('*');
    const fleetWalletIntercept = new FleetWalletIntercept();
    const fleetVehiclesListIntercept = new FleetVehiclesListIntercept('*', '*');
    const plannedPrograms = new CommissionProgramsListIntercept('drivers', CommissionProgramType.PLANNED);
    const brandingCalculationPeriodsOldInterceptor = new BrandingCalculationPeriodsOldInterceptor();
    const brandingCalculationsProgramOldInterceptor = new BrandingCalculationsProgramOldInterceptor();
    const brandingBonusProgramsListOldIntercept = new BrandingBonusProgramsListOldIntercept('*');

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      fleetWalletIntercept.apply({ name: 'ok' });
      fleetVehiclesListIntercept.apply({ name: 'ok' });
      plannedPrograms.apply({ name: 'ok' });
      brandingCalculationPeriodsOldInterceptor.apply({ name: 'ok' });
      brandingCalculationsProgramOldInterceptor.apply({ name: 'ok' });
      brandingBonusProgramsListOldIntercept.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('commissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('commission-tab').click();
      cy.getBySel('commission-tab-planned').should('exist').click();
    });

    it('[5657] should display empty state if not any programs', () => {
      plannedPrograms.apply({ name: 'ok', props: { count: 0 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });
    });

    it('[5658] should filter planned programs by driver filter', () => {
      cy.getBySel('drivers-control').should('exist');
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      plannedPrograms.apply({ name: 'ok', props: { count: 1 } });
      cy.getBySel('planned-commission-programs-list').should('exist');
      cy.getBySel('filter-reset-btn').should('exist').click();
    });

    it('[5659] should display planned programs list', () => {
      plannedPrograms.apply({ name: 'ok', props: { count: 5 } }).as('getPrograms');
      cy.wait('@getPrograms').then(() => {
        cy.get('@getPrograms').should('exist');
        cy.getBySel('full-name').should('be.visible').contains('Прізвище та імʼя');
        cy.getBySel('signal').should('be.visible').contains('Позивний');
        cy.getBySel('phone').should('be.visible').contains('Номер телефону');
        cy.getBySel('program').should('be.visible').contains('Назва програми');
        cy.getBySel('period').should('be.visible').contains('Період');
        cy.getBySel('min-rating').should('be.visible').contains('Вимоги до рейтингу');
        cy.getBySel('min-commission').should('be.visible').contains('Мінімальна комісія');
        cy.getBySel('orders-min-commission').should('be.visible').contains('Замовлень для мін.комісії');
        cy.getBySel('used-profit-budget').should('be.visible').contains('Бюджет економії');
      });
    });

    it('[5641] should redirect to driver details page by click to full name', () => {
      cy.getBySel('driver-full-name-link')
        .should('exist')
        .should('have.attr', 'href')
        .and('match', /\/workspace\/drivers\/details\/[\da-z-]+$/);
    });
  });
}
