import { UklonGarageApplicationStatus } from '@data-access';

import { UklonGarageApplicationsIntercept } from '../../../support/interceptor';
import { FleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/drivers/photo-control/has-active-tickets';
import { isMockingData } from '../../../support/utils';

function openDialog(type: 'approve' | 'reject'): void {
  cy.getBySel('garage-approve-menu-btn').should('exist').click();
  cy.getBySel(type === 'approve' ? 'garage-approve-btn' : 'garage-reject-btn').click();
}

if (isMockingData()) {
  describe('Uklon Garage applications', () => {
    const fleetId = '*';

    const garageApplications = new UklonGarageApplicationsIntercept(fleetId);
    const drivers = new FleetDriverListIntercept(fleetId);
    const hasActiveTickets = new DriverPhotoControlHasActiveTicketsIntercept('*');

    beforeEach(() => {
      drivers.apply({ name: 'ok' });
      garageApplications.apply({ name: 'ok', props: { count: 1, status: UklonGarageApplicationStatus.REVIEW } });
      hasActiveTickets.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('garageApplications');
      cy.visit('workspace/drivers#garage-applications');
    });

    it('should not display applications tab if there are no applications', () => {
      garageApplications.apply({ name: 'ok' });
      cy.reload();
      cy.getBySel('tab-label-GarageApplications').should('not.exist');
    });

    describe('Applications exist', () => {
      beforeEach(() => {
        cy.getBySel('tab-label-GarageApplications').click();
      });

      it('should display applications tab if applications exist', () => {
        cy.getBySel('tab-label-GarageApplications').should('exist');
      });

      it('should navigate to applications list', () => {
        cy.getBySel('tab-label-GarageApplications').click();
        cy.url().should('contain', '#garage-applications');
      });

      it('should have approve/reject options if status is REVIEW', () => {
        cy.getBySel('garage-application-status').should('exist').should('contain', 'В роботі');
        cy.getBySel('garage-approve-menu-btn').should('exist').click();
        cy.getBySel('garage-approve-btn').should('exist').should('be.visible');
        cy.getBySel('garage-reject-btn').should('exist').should('be.visible');
      });

      it('should not have approve/reject options if application is not in status REVIEW', () => {
        garageApplications.apply({ name: 'ok', props: { count: 1, status: UklonGarageApplicationStatus.REJECTED } });
        cy.reload();
        cy.getBySel('garage-approve-menu-btn').should('not.exist');

        garageApplications.apply({ name: 'ok', props: { count: 1, status: UklonGarageApplicationStatus.APPROVED } });
        cy.reload();
        cy.getBySel('garage-approve-menu-btn').should('not.exist');

        garageApplications.apply({
          name: 'ok',
          props: { count: 1, status: UklonGarageApplicationStatus.CLOSED_BY_PARALLEL_REGISTRATION },
        });
        cy.reload();
        cy.getBySel('garage-approve-menu-btn').should('not.exist');
      });

      it.skip('should display additional status badge if application is approved by Uklon manager', () => {
        garageApplications.apply({
          name: 'ok',
          props: { count: 1, status: UklonGarageApplicationStatus.CLOSED_BY_PARALLEL_REGISTRATION },
        });
        cy.reload();
        cy.getBySel('garage-approved-by-manager-badge').should('exist').should('contain', 'M');
      });

      describe('Approve/reject/review flow', () => {
        describe('Approve', () => {
          it('should open approve dialog', () => {
            openDialog('approve');
            cy.get('upf-approve-application').should('exist');
            cy.getBySel('garage-dialog-approve-close-btn').should('exist');
            cy.getBySel('garage-dialog-approve-cancel-btn').should('exist');
            cy.getBySel('garage-dialog-approve-ok-btn').should('exist').should('contain', 'Підтвердити');
          });

          it('should close dialog', () => {
            openDialog('approve');
            cy.get('upf-approve-application').should('exist');
            cy.getBySel('garage-dialog-approve-close-btn').click();
            cy.get('upf-approve-application').should('not.exist');

            openDialog('reject');
            cy.get('upf-approve-application').should('exist');
            cy.getBySel('garage-dialog-approve-cancel-btn').click();
            cy.get('upf-approve-application').should('not.exist');
          });

          it('should successfully approve application', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/approve', { statusCode: 204 });
            openDialog('approve');
            cy.getBySel('garage-dialog-approve-ok-btn').click();

            cy.getBySel('garage-application-status').should('contain', 'Підтверджено');
            cy.getBySel('garage-approve-menu-btn').should('not.exist');
          });

          it.skip('should fail approve if application is already approved by manager', () => {
            cy.getBySel('garage-approved-by-manager-badge').should('not.exist');

            cy.intercept('POST', 'api/uklon-garage/application/*/approve', { statusCode: 409 });
            openDialog('approve');
            cy.getBySel('garage-dialog-approve-ok-btn').click();

            cy.getBySel('garage-application-status').should('contain', 'Підтверджено');
            cy.getBySel('garage-approved-by-manager-badge').should('exist').should('contain', 'M');
            cy.get('.toast.error').should('exist');
          });

          it('should display notification if approve failed', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/approve', { statusCode: 400 });
            openDialog('approve');
            cy.getBySel('garage-dialog-approve-ok-btn').click();
            cy.getBySel('garage-application-status').should('contain', 'В роботі');
            cy.get('.toast.error').should('exist');
          });
        });

        describe('Reject', () => {
          it('should open reject dialog', () => {
            openDialog('reject');
            cy.get('upf-approve-application').should('exist');
            cy.getBySel('garage-dialog-approve-close-btn').should('exist');
            cy.getBySel('garage-dialog-approve-cancel-btn').should('exist');
            cy.getBySel('garage-dialog-approve-ok-btn').should('exist').should('contain', 'Відхилити');
          });

          it('should successfully reject application', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/reject', { statusCode: 204 });
            openDialog('reject');
            cy.getBySel('garage-dialog-approve-ok-btn').click();

            cy.getBySel('garage-application-status').should('contain', 'Відхилено');
            cy.getBySel('garage-approve-menu-btn').should('not.exist');
          });

          it('should display notification if rejection failed', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/reject', { statusCode: 400 });
            openDialog('reject');
            cy.getBySel('garage-dialog-approve-ok-btn').click();
            cy.getBySel('garage-application-status').should('contain', 'В роботі');
            cy.get('.toast.error').should('exist');
          });
        });

        describe('Review', () => {
          beforeEach(() => {
            garageApplications.apply({ name: 'ok', props: { count: 1, status: UklonGarageApplicationStatus.NEW } });
          });

          it('should display review bth if status is NEW', () => {
            cy.getBySel('garage-approve-menu-btn').should('not.exist');
            cy.getBySel('garage-review-btn').should('exist').should('contain', 'Взяти в роботу');
          });

          it('should successfully review application', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/review', { statusCode: 204 });

            cy.getBySel('garage-approve-menu-btn').should('not.exist');
            cy.getBySel('garage-review-btn').click();
            cy.getBySel('garage-application-status').should('contain', 'В роботі');
            cy.getBySel('garage-approve-menu-btn').should('exist');
          });

          it('should display notification if review failed', () => {
            cy.intercept('POST', 'api/uklon-garage/application/*/review', { statusCode: 400 });
            cy.getBySel('garage-review-btn').click();
            cy.getBySel('garage-application-status').should('contain', 'Нова');
            cy.get('.toast.error').should('exist');
          });
        });
      });
    });
  });
}
