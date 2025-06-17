import { CommissionProgramType } from '@constant';

import { CommissionProgramsListIntercept } from '../../../../../support/interceptor/bonuses/commission-programs/list';
import { FleetDriverListIntercept } from '../../../../../support/interceptor/drivers';
import { FleetVehiclesListIntercept } from '../../../../../support/interceptor/vehicles/list';
import { isMockingData } from '../../../../../support/utils';

if (isMockingData()) {
  describe('Vehicle commission programs - active programs', () => {
    const drivers = new FleetDriverListIntercept('*');
    const vehicles = new FleetVehiclesListIntercept('*', '*');
    const activePrograms = new CommissionProgramsListIntercept('vehicles', CommissionProgramType.ACTIVE);

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      vehicles.apply({ name: 'ok' });
      activePrograms.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('vehicleActiveCommissionPrograms');
      cy.visit('workspace/general');
      cy.getBySel('menu-toggle-btn').should('be.visible').as('menu');
      cy.getBySel('side-nav-menu-bonuses').click();
      cy.getBySel('vehicle-commission-tab').click();
    });

    it('should exist vehicle commission programs tab with sub tabs: active, planned, archived', () => {
      cy.getBySel('vehicle-commission-tab').should('be.visible');
      cy.getBySel('commission-tab-active').should('be.visible');
      cy.getBySel('commission-tab-planned').should('be.visible');
      cy.getBySel('commission-tab-archived').should('be.visible');
    });

    it('[7615] should display tooltip - what is commission programs?', () => {
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

    it('[7630] should display empty state if not any programs', () => {
      activePrograms.apply({ name: 'ok', props: { count: 0 } }).as('getPrograms');

      cy.wait('@getPrograms').then(() => {
        cy.getBySel('loading-indicator').should('not.exist');
        cy.getBySel('no-data').should('exist').should('be.visible');
      });
    });

    it('[7633] should display tooltip about program progress', () => {
      activePrograms.apply({
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

    it('[7634] should show budget tooltip', () => {
      cy.getBySel('profit-budget-tooltip').should('be.visible').click();
      cy.getBySel('profit-budget-tooltip-rule1')
        .should('exist')
        .should('contain.text', 'Сума економії - фактична сума економії в рамках комісійної програми.');
      cy.getBySel('profit-budget-tooltip-rule2')
        .should('exist')
        .should('contain.text', 'Бюджет економії - загальна сума економії виділена в рамках комісійної програми');
    });

    describe('[7622] should filter active programs by vehicle filter', () => {
      beforeEach(() => {
        cy.getBySel('vehicle-control').should('exist');
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.useVehicleFilter(1);
        activePrograms.apply({ name: 'ok', props: { count: 1 } });
        cy.getBySel('active-commission-programs-list').should('exist');
        cy.getBySel('filter-reset-btn').should('exist').click();
      });

      it('should display vehicle active programs list', () => {
        cy.getBySel('active-commission-programs-list').should('be.visible');
        cy.getBySel('vehicle').should('be.visible').should('contain.text', 'Авто');
        cy.getBySel('program').should('be.visible').should('contain.text', 'Назва програми');
        cy.getBySel('progress').should('be.visible').should('contain.text', 'Зарахування прогресу');
        cy.getBySel('period').should('be.visible').should('contain.text', 'Період');
        cy.getBySel('driver').should('be.visible').should('contain.text', 'Поточний водій');
        cy.getBySel('driver-signal').should('be.visible').should('contain.text', 'Позивний');
        cy.getBySel('rating').should('be.visible').should('contain.text', 'Рейтинг та вимоги');
        cy.getBySel('orders-completed').should('be.visible').should('contain.text', 'Виконано замовлень');
        cy.getBySel('commission').should('be.visible').should('contain.text', 'Поточна комісія');
        cy.getBySel('used-profit-budget').should('be.visible').should('contain.text', 'Сума економії');
        cy.getBySel('profit-budget').should('be.visible').should('contain.text', 'Бюджет економії');
      });

      it('should display data in rows', () => {
        cy.getBySel('vehicle-link').should('be.visible').should('contain.text', 'AQA7297');
        cy.getBySel('vehicle-make-model').should('be.visible').should('contain.text', 'Hyundai Accent');
        cy.getBySel('program-name').should('be.visible').should('contain.text', 'Program name - first program');
        cy.getBySel('progress-value').should('be.visible').should('contain.text', 'Завжди');
        cy.getBySel('period').should('be.visible').should('contain.text', '17.10.2024 07:03 - 19.10.2024 07:03');
        cy.getBySel('driver-full-name-link')
          .should('be.exist')
          .should('have.attr', 'href')
          .and('match', /\/workspace\/drivers\/details\/[\da-z-]+$/);
        cy.getBySel('driver-signal').should('be.visible').should('contain', '501313');
        cy.getBySel('rating-icon').should('be.visible');
        cy.getBySel('rating-value').should('be.visible').should('contain', '3.50/3.00');
        cy.getBySel('progress-bar').should('exist');
        cy.getBySel('progress-bar-whole-range-value').should('be.visible');
        cy.getBySel('driver-rating-err-requirements').should('not.exist');
        cy.getBySel('current-commission').should('be.visible').should('contain.text', '10%');
        cy.getBySel('used-profit-budget-value').should('be.visible').should('contain.text', '₴ 1 034.21');
        cy.getBySel('profit-budget-value').should('be.visible').should('contain.text', '₴ 8 999.99');
        cy.getBySel('expanded-icon').should('be.visible');
      });

      it('[7629] should expanded view', () => {
        cy.getBySel('active-commission-programs-list').should('exist');
        cy.getBySel('expanded-icon').first().should('exist').click();
        cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
        cy.getBySel('current-completed-orders').should('be.visible').should('contain.text', 3);
        cy.getBySel('progress-bar').should('exist');
        cy.getBySel('progress-bar-whole-range-value').should('be.visible');
        cy.getBySel('orders-progress-stepper').should('exist');
      });
    });

    it('should display requirement panel', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('requirement-panel').should('be.visible');
    });

    it('should driver rating is red if rating less than requirement', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 300, min_rating: 4 } });
      cy.getBySel('driver-rating-err-requirements')
        .should('exist')
        .should('be.visible')
        .should('have.class', 'tw-text-accent-coral-light');
    });

    it('should progress bar has green color', () => {
      activePrograms.apply({ name: 'ok', props: { count: 1, driver_rating: 500, min_rating: 4, completed_orders: 4 } });
      cy.getBySel('expanded-icon').should('exist').click();
      cy.getBySel('expanded-view-desktop').should('exist').should('be.visible');
      cy.getBySel('progress-bar').should('exist');
      cy.getBySel('progress-bar-leaner')
        .should('be.visible')
        .should('have.css', 'background-color', 'rgb(51, 204, 161)');
    });
  });
}
