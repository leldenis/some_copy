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
  describe('Driver commission programs - archived programs', () => {
    const drivers = new FleetDriverListIntercept('*');
    const fleetWalletIntercept = new FleetWalletIntercept();
    const fleetVehiclesListIntercept = new FleetVehiclesListIntercept('*', '*');
    const activePrograms = new CommissionProgramsListIntercept('drivers', CommissionProgramType.ACTIVE);
    const archivedPrograms = new CommissionProgramsListIntercept('drivers', CommissionProgramType.ARCHIVED);
    const brandingCalculationPeriodsOldInterceptor = new BrandingCalculationPeriodsOldInterceptor();
    const brandingCalculationsProgramOldInterceptor = new BrandingCalculationsProgramOldInterceptor();
    const brandingBonusProgramsListOldIntercept = new BrandingBonusProgramsListOldIntercept('*');

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      fleetWalletIntercept.apply({ name: 'ok' });
      fleetVehiclesListIntercept.apply({ name: 'ok' });
      activePrograms.apply({ name: 'ok' });
      archivedPrograms.apply({ name: 'ok' });
      brandingCalculationPeriodsOldInterceptor.apply({ name: 'ok' });
      brandingCalculationsProgramOldInterceptor.apply({ name: 'ok' });
      brandingBonusProgramsListOldIntercept.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('commissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('commission-tab').click();
      cy.getBySel('commission-tab-archived').should('exist').click();
    });

    it('[5639]  should display tooltip - what is commission programs?', () => {
      cy.getBySel('profit-budget-tooltip').should('be.visible').click();
      cy.getBySel('profit-budget-tooltip-rule1')
        .should('exist')
        .should('contain.text', 'Сума економії - фактична сума економії в рамках комісійної програми.');
      cy.getBySel('profit-budget-tooltip-rule2')
        .should('exist')
        .should('contain.text', 'Бюджет економії - загальна сума економії виділена в рамках комісійної програми');
    });

    it('[5669] should display empty state if not any programs', () => {
      archivedPrograms.apply({ name: 'ok', props: { count: 0 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });
    });

    it('[5670] should filter archived programs by driver filter', () => {
      cy.getBySel('drivers-control').should('exist');
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      archivedPrograms.apply({ name: 'ok', props: { count: 1 } });
      cy.getBySel('archived-commission-programs-list').should('exist');
      cy.getBySel('filter-reset-btn').should('exist').click();
    });

    it('[5672] should display archived programs list', () => {
      archivedPrograms.apply({ name: 'ok', props: { count: 3 } }).as('getPrograms');
      cy.wait('@getPrograms').then(() => {
        cy.get('@getPrograms').should('exist');
        cy.getBySel('full-name').should('be.visible').contains('Прізвище та імʼя');
        cy.getBySel('signal').should('be.visible').contains('Позивний');
        cy.getBySel('phone').should('be.visible').contains('Номер телефону');
        cy.getBySel('program').should('be.visible').contains('Назва програми');
        cy.getBySel('period').should('be.visible').contains('Період');
        cy.getBySel('orders-completed').should('be.visible').contains('Виконано замовлень');
        cy.getBySel('min-rating').should('be.visible').contains('Вимоги до рейтингу');
        cy.getBySel('min-commission').should('be.visible').contains('Мінімальна комісія');
        cy.getBySel('used-profit-budget').should('be.visible').contains('Сума економії');
        cy.getBySel('profit-budget').should('be.visible').contains('Бюджет економії');
      });
    });

    it('[5675] should expanded view', () => {
      cy.getBySel('archived-commission-programs-list').should('exist');
      cy.getBySel('expanded-icon').first().should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('completed-orders')
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const numberValue = Number.parseFloat(text);
          expect(numberValue).to.be.at.least(0);
        });
      cy.getBySel('progress-bar').should('exist');
      cy.getBySel('progress-bar-by-current-range-value').should('be.visible');
      cy.getBySel('orders-progress-stepper').should('exist');
    });

    it('[5676] should display info panel about program period', () => {
      cy.getBySel('info-panel-program-period')
        .should('exist')
        .contains('Завершені комісійні програми відображаються за останні 30 днів');
    });

    it('should display requirement panel', () => {
      archivedPrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('requirement-panel').should('be.visible');
    });

    it('should driver rating is red if rating less than requirement', () => {
      archivedPrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('driver-rating')
        .should('exist')
        .should('be.visible')
        .should('have.class', 'tw-text-accent-coral-light');
    });

    it('should progress bar has black color', () => {
      archivedPrograms.apply({
        name: 'ok',
        props: { count: 1, driver_rating: 500, min_rating: 4, completed_orders: 4 },
      });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('progress-bar').should('exist');
      cy.getBySel('progress-bar-leaner').should('be.visible').should('have.css', 'background-color', 'rgb(69, 71, 84)');
    });

    it('should redirect to driver details page by click to full name', () => {
      cy.getBySel('driver-full-name-link')
        .should('exist')
        .should('have.attr', 'href')
        .and('match', /\/workspace\/drivers\/details\/[\da-z-]+$/);
    });
  });
}
