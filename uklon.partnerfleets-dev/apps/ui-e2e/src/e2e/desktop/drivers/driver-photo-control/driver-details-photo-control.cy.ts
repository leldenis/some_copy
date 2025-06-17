import { TicketStatus } from '@constant';
import { PHOTO_CONTROL_STATUS_STYLING } from '@ui/modules/vehicles/consts';

import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { fleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { fleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetDriverStatisticIntercept } from '../../../../support/interceptor/drivers/statistic';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { isMockingData } from '../../../../support/utils';

const driverDetails = new FleetDriverIntercept('*', '*');
const driverPhotoControl = new DriverPhotoControlIntercept('*');

if (isMockingData()) {
  describe('Driver photo control list', () => {
    beforeEach(() => {
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });
      fleetDriverRideConditionsIntercept.apply({ name: 'ok' });
      fleetDriverStatisticIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    });

    describe('[7147] should exist data in table', () => {
      beforeEach(() => {
        driverDetails.apply({ name: 'ok' });
        driverPhotoControl.apply({ name: 'ok', props: { deadline_to_send: 1_734_731_999 } });

        cy.clearLocalStorage();
        cy.loginWithSession('driverPhotoControl');
        cy.visit('/workspace/drivers/details/*');
        cy.useDateRangeFilter('last-week');
      });

      it('should display tickets indicator', () => {
        cy.getBySel('driver-photo-control-panel').should('be.visible');
      });

      it('should display deadline panel', () => {
        cy.getBySel('photo-control-deadline-msg').should('be.visible').should('contain.text', 'протерміновано');
      });

      it('should display photo control reason', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-reason').should('be.visible').contains('Протермінований документ');
      });

      it('should display required picture types', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-picture-types').should('be.visible');
        cy.getBySel('photo-control-picture-0').should('be.visible').contains('Фото профілю');
        cy.getBySel('photo-control-picture-1').should('be.visible').contains('Водійське посвідчення (лицьовий бік)');
        cy.getBySel('photo-control-picture-2').should('be.visible').contains('Водійське посвідчення (зворотній бік)');
      });

      it('should display photo control button', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-btn').should('be.visible');
      });
    });

    describe('Driver photo control reject reasons', () => {
      const rejectReasons = [
        {
          testCaseId: '7173',
          rejectReason: 'driver_registration_deadline_expired',
          expected: 'Термін на заповнення минув',
        },
        { testCaseId: '7174', rejectReason: 'fraud', expected: 'Заблоковано відділом безпеки' },
        { testCaseId: '7175', rejectReason: 'document_expired', expected: 'Документ протерміновано' },
        { testCaseId: '7176', rejectReason: 'youcontrol', expected: 'Заблоковано відділом безпеки' },
        { testCaseId: '7177', rejectReason: 'other', expected: 'Фото не відповідають вимогам' },
      ];

      rejectReasons.forEach(({ testCaseId, rejectReason, expected }) => {
        it(`[${testCaseId}] should handle ${rejectReason}`, () => {
          driverDetails.apply({ name: 'ok' });
          driverPhotoControl.apply({
            name: 'ok',
            props: {
              status: TicketStatus.REJECTED,
              deadline_to_send: null,
              activity_log: [
                {
                  status: TicketStatus.REJECTED,
                  actual_from: 1,
                  transferred_by_account_id: '',
                  transferred_by_full_name: '',
                  comment: rejectReason,
                },
              ],
            },
          });

          cy.clearLocalStorage();
          cy.loginWithSession('driverPhotoControl');
          cy.visit('/workspace/drivers/details/*');
          cy.useDateRangeFilter('last-week');
          cy.getBySel('driver-photo-control-panel').should('be.visible');
          cy.getBySel('info-panel-btn').click();
          cy.getBySel('photo-control-comment').should('contain.text', expected);
        });
      });
    });

    describe('[7172] Clarification status with actual deadline', () => {
      beforeEach(() => {
        driverDetails.apply({ name: 'ok' });
        driverPhotoControl.apply({
          name: 'ok',
          props: {
            status: TicketStatus.CLARIFICATION,
            deadline_to_send: Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000),
            activity_log: [
              {
                status: TicketStatus.CLARIFICATION,
                actual_from: 1,
                transferred_by_account_id: '',
                transferred_by_full_name: '',
                comment: 'low_quality_photo',
              },
            ],
          },
        });

        cy.clearLocalStorage();
        cy.loginWithSession('driverPhotoControl');
        cy.visit('/workspace/drivers/details/*');
        cy.useDateRangeFilter('last-week');
      });

      it('should display tickets indicator', () => {
        cy.getBySel('driver-photo-control-panel').should('be.visible');
      });

      it('should display deadline panel', () => {
        cy.getBySel('photo-control-deadline-msg').should('contain.text', 'залишилось днів: 7');
      });

      it('should display photo control reason', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-reason').should('be.visible').contains('Фото розмите / низької якості');
      });

      it('should display required picture types', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-picture-types').should('be.visible');
        cy.getBySel('photo-control-picture-0').should('be.visible').contains('Фото профілю');
        cy.getBySel('photo-control-picture-1').should('be.visible').contains('Водійське посвідчення (лицьовий бік)');
        cy.getBySel('photo-control-picture-2').should('be.visible').contains('Водійське посвідчення (зворотній бік)');
      });

      it('should display photo control button', () => {
        cy.getBySel('info-panel-btn').should('exist').click();
        cy.getBySel('photo-control-btn').should('be.visible');
      });
    });

    describe('BlockedByManager vehicle photo control', () => {
      beforeEach(() => {
        driverDetails.apply({ name: 'ok' });
        driverPhotoControl.apply({ name: 'ok', props: { status: TicketStatus.BLOCKED_BY_MANAGER } });

        cy.clearLocalStorage();
        cy.loginWithSession('driverPhotoControl');
        cy.visit('/workspace/drivers/details/*');
        cy.useDateRangeFilter('last-week');
        cy.getBySel('driver-photo-control-panel').should('be.visible');
        cy.getBySel('info-panel-btn').should('not.exist');
      });

      it('[7654] should display same status for Review and BlockedByManager statuses', () => {
        cy.getBySel('driver-photo-control-panel').find('upf-info-panel').as('panel');
        cy.getBySel('info-panel-btn').should('not.exist');
        cy.get('@panel')
          .should('exist')
          .should('be.visible')
          .should('have.class', PHOTO_CONTROL_STATUS_STYLING[TicketStatus.REVIEW].color);
        cy.getBySel('driver-photo-control-panel-status').should('be.visible').should('contain', 'На перевірці');
      });
    });
  });
}
