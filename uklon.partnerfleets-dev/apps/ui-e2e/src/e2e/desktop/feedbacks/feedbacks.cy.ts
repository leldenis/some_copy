import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { DriverFeedbacksIntercept } from '../../../support/interceptor/feedbacks';
import { AccountKind, getAccountByKind, isMockingData } from '../../../support/utils';

describe('Drivers feedbacks', () => {
  const fleetId = '*';
  const driverFeedbacks = new DriverFeedbacksIntercept(fleetId);

  beforeEach(() => {
    cy.clearLocalStorage();
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('driversFeedbacks', notificationFleetAccount.username, notificationFleetAccount.password);

    if (isMockingData()) {
      fleetDriverListIntercept.apply({ name: 'ok', props: { count: 2 } });
      driverFeedbacks.apply({ name: 'ok' });
    }

    cy.visit('workspace/feedbacks');
  });

  it('should display empty state', () => {
    if (isMockingData()) {
      driverFeedbacks.apply({ name: 'ok', props: { items: [] } });
    }
    cy.useDateRangeFilter('custom', '01.10.2024', '30.10.2024');
    cy.getBySel('no-data').should('exist').should('be.visible');
  });

  describe('Feedbacks filters', () => {
    it('[5492] should have date and drivers filters', () => {
      cy.getBySel('date-range-control').should('exist');
      cy.getBySel('drivers-control').should('exist');
    });

    it('should have default filters values', () => {
      cy.getBySel('date-range-control').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it('should display Clear button if date filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it('should display Clear button if driver filter changed', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.getBySel('filter-reset-btn').should('exist');
    });

    it('should reset filters to default on Clear button click', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.getBySel('date-range-control').should('contain', 'Поточний тиждень');
      cy.getBySel('drivers-control').should('contain', '');
    });

    it('should not display Clear button if selected filters are the same as default', () => {
      cy.getBySel('filter-reset-btn').should('not.exist');
      cy.useDriverFilter();
      cy.useDateRangeFilter('today');
      cy.getBySel('filter-reset-btn').should('exist').click();
      cy.useDateRangeFilter();
      cy.getBySel('filter-reset-btn').should('not.exist');
    });
  });

  describe('Feedbacks list', () => {
    beforeEach(() => cy.useDateRangeFilter('custom', '01.10.2024', '30.10.2024'));

    it('[5491] should display feedbacks list', () => {
      cy.getBySel('drivers-feedbacks-list').should('exist').should('be.visible');
    });

    it('should have header row', () => {
      cy.getBySel('drivers-feedbacks-header-row').should('exist').should('be.visible');
    });

    it('[5493] should have data row', () => {
      cy.getBySel('drivers-feedbacks-row').should('exist').should('be.visible');
    });

    if (isMockingData()) {
      describe('Header row', () => {
        it('should have date/time header', () => {
          cy.getBySel('date-time-header').should('be.visible').should('contain', 'Дата').should('contain', 'Час');
        });

        it('should have driver header', () => {
          cy.getBySel('driver-header').should('be.visible').should('contain', 'Водій');
        });

        it('should have rating header', () => {
          cy.getBySel('rating-header').should('be.visible').should('contain', 'Оцінка');
        });

        it('should have feedback header', () => {
          cy.getBySel('feedback-header').should('be.visible').should('contain', 'Шаблонний відгук');
        });

        it('should have comment header', () => {
          cy.getBySel('comment-header').should('be.visible').should('contain', 'Індивідуальний відгук');
        });
      });

      describe('Data row', () => {
        it('should have date/time cell', () => {
          cy.getBySel('date-time-cell')
            .eq(0)
            .should('be.visible')
            .should('contain', '30.10.2024')
            .should('contain', '14:18');
        });

        it('should have driver cell', () => {
          cy.getBySel('driver-cell')
            .eq(0)
            .find('a')
            .should('exist')
            .should('have.attr', 'href', '/workspace/drivers/details/73709b95-4a71-487a-bd1e-1bd3539f6a11');
        });

        it('should have rating cell', () => {
          cy.getBySel('rating-cell').eq(0).should('be.visible').should('contain', '5');
          cy.get('.mark-icon').should('be.visible').should('contain', 'grade');
        });

        it('should have comment cell', () => {
          cy.getBySel('comment-cell').eq(0).should('be.visible').should('contain', '-');
        });
      });
    }
  });
});
