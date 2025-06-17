import { CommissionProgramType } from '@constant';

import { CommissionProgramsListIntercept } from '../../../../../support/interceptor/bonuses/commission-programs/list';
import { FleetDriverListIntercept } from '../../../../../support/interceptor/drivers';
import { FleetVehiclesListIntercept } from '../../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../../support/utils';

if (isMockingData()) {
  describe('Vehicle commission programs - planned programs', () => {
    const drivers = new FleetDriverListIntercept('*');
    const vehicles = new FleetVehiclesListIntercept('*', '*');
    const plannedPrograms = new CommissionProgramsListIntercept('vehicles', CommissionProgramType.PLANNED);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      vehicles.apply({ name: 'ok' });
      plannedPrograms.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('vehiclePlannedCommissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('vehicle-commission-tab').click();
      cy.getBySel('commission-tab-planned').should('exist').click();
    });

    it('should exist vehicle commission programs tab with sub tabs: active, planned, archived', () => {
      cy.getBySel('vehicle-commission-tab').should('be.visible');
      cy.getBySel('commission-tab-active').should('be.visible');
      cy.getBySel('commission-tab-planned').should('be.visible');
      cy.getBySel('commission-tab-archived').should('be.visible');
    });

    it('should display tooltip - what is commission programs?', () => {
      cy.getBySel('programs-tooltip').should('be.visible').click();
      cy.getBySel('programs-tooltip-content').should('exist');
      cy.getBySel('programs-tooltip-rule1')
        .should('exist')
        .contains(
          'Комісійні програми авто - це програми для авто, які дозволяють отримати знижену комісію після виконання необхідної кількості замовлень',
        );
      cy.getBySel('programs-tooltip-rule2')
        .should('exist')
        .contains(
          'Виконуючи замовлення під час дії програми, авто отримує менший відсоток комісії на всі поїздки до закінчення програми',
        );
    });

    it('[7656] should display empty state if not any programs', () => {
      plannedPrograms.apply({ name: 'ok', props: { count: 0 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });
    });

    it('[7658] should display tooltip about program progress', () => {
      plannedPrograms.apply({
        name: 'ok',
        props: { count: 1, driver_id: '2656c75a-a5ef-4c42-a71d-d0b18b6c1714', always_add_progress_if_satisfied: true },
      });
      cy.getBySel('progress-tooltip').should('exist').click();
      cy.getBySel('progress-tooltip-rule1')
        .should('exist')
        .should(
          'contain.text',
          '“Коли програма активна” - виконані замовлення будуть додаватися до прогресу програми, якщо вона є найбільш вигідною для драйвера серед усіх програм.',
        );
      cy.getBySel('progress-tooltip-rule2')
        .should('exist')
        .should(
          'contain.text',
          '“Завжди” - при умові, що програма співпадає по параметрам замовлення, вони будуть враховані, навіть якщо діє інша програма.',
        );
    });

    describe('[7660] should filter planned programs by vehicle filter', () => {
      beforeEach(() => {
        cy.getBySel('vehicle-control').should('exist');
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useVehicleFilter(1);
        plannedPrograms.apply({ name: 'ok', props: { count: 1 } });
        cy.getBySel('planned-commission-programs-list').should('exist');
        cy.getBySel('filter-reset-btn').should('exist').click();
      });

      it('should display vehicle planned programs list', () => {
        cy.getBySel('planned-commission-programs-list').should('be.visible');
        cy.getBySel('vehicle').should('be.visible').should('contain.text', 'Авто');
        cy.getBySel('program').should('be.visible').should('contain.text', 'Назва програми');
        cy.getBySel('progress').should('be.visible').should('contain.text', 'Зарахування прогресу');
        cy.getBySel('period').should('be.visible').should('contain.text', 'Період');
        cy.getBySel('rating').should('be.visible').should('contain.text', 'Вимоги до рейтингу');
        cy.getBySel('min-commission').should('be.visible').should('contain.text', 'Мінімальна комісія');
        cy.getBySel('orders-min-commission').should('be.visible').should('contain.text', 'Замовлень для мін.комісії');
        cy.getBySel('profit-budget').should('be.visible').should('contain.text', 'Бюджет економії');
      });

      it('[7659] should display profit budget tooltip', () => {
        cy.getBySel('profit-budget-tooltip').should('be.visible').trigger('mouseenter');
        cy.get('.tippy-content')
          .should('be.visible')
          .should('contain.text', 'Бюджет економії - загальна сума економії виділена в рамках комісійної програми.');
      });

      it('[7671] should display data in rows', () => {
        cy.getBySel('vehicle-link').should('be.visible').should('contain.text', 'AQA7297');
        cy.getBySel('vehicle-link')
          .should('be.exist')
          .should('have.attr', 'href')
          .and('match', /\/workspace\/vehicles\/details\/[\da-z-]+$/);
        cy.getBySel('vehicle-make-model').should('be.visible').should('contain.text', 'Hyundai Accent');
        cy.getBySel('program-name').should('be.visible').should('contain.text', 'Program name - first program');
        cy.getBySel('progress-value').should('be.visible').should('contain.text', 'Завжди');
        cy.getBySel('period').should('be.visible').should('contain.text', '17.10.2024 07:03 - 19.10.2024 07:03');
        cy.getBySel('rating-icon').should('be.visible');
        cy.getBySel('rating-value').should('be.visible').should('contain', '3.00');
        cy.getBySel('min-commission').should('be.visible').should('contain.text', '0%');
        cy.getBySel('min-orders-to-min-commission').should('be.visible').should('contain.text', '21');
        cy.getBySel('profit-budget-value').should('be.visible').should('contain.text', '₴ 8 999.99');
        cy.getBySel('expanded-icon').should('be.visible');
      });

      it('[7661] should expanded view', () => {
        cy.getBySel('planned-commission-programs-list').should('exist');
        cy.getBySel('expanded-icon').first().should('exist').click();
        cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
        cy.getBySel('orders-progress-title').should('be.visible').should('contain.text', 'Рівні виконання замовлень:');
        cy.getBySel('orders-progress-stepper').should('exist');
      });
    });
  });
}
