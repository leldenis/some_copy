import { DriverPhotoControlCreatingReason, TicketStatus } from '@constant';

import { FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { isMockingData } from '../../../../support/utils';

const driverDetails = new FleetDriverIntercept('*', '*');
const driverPhotoControl = new DriverPhotoControlIntercept('*');

if (isMockingData()) {
  describe('Driver photo control list', () => {
    beforeEach(() => {
      driverDetails.apply({
        name: 'ok',
        props: { firstName: 'Водій', lastName: 'Новий' },
      });
      driverPhotoControl.apply({ name: 'ok', props: { status: TicketStatus.DRAFT, deadline_to_send: 1_734_731_999 } });

      cy.clearLocalStorage();
      cy.loginWithSession('driverPhotoControlTicket');
      cy.visit('/workspace/drivers/photo-control/*');
    });

    describe('if ticket has status draft', () => {
      it('should display photo control reason panel if status draft', () => {
        cy.getBySel('photo-control-reason-panel-draft').should('be.visible');
        cy.getBySel('photo-control-reason-panel-clarification').should('not.exist');
        cy.getBySel('ticket-reason').should('be.visible').contains('Протермінований документ');
      });

      it('should display photo control deadline panel', () => {
        cy.getBySel('photo-control-deadline-panel').should('be.visible');
      });

      it('should display photo control instructions', () => {
        cy.getBySel('photo-control-instructions')
          .should('be.visible')
          .contains(
            'Додайте чіткі розбірливі фото чинних документів та/або фото профілю зробленого при гарному освітленні',
          );
      });

      it('should display photo categories', () => {
        cy.getBySel('photo-category-driver_avatar_photo').should('be.visible');
        cy.getBySel('photo-category-driver_license_front_copy').should('be.visible');
        cy.getBySel('photo-category-driver_license_reverse_copy').should('be.visible');
        cy.getBySel('photo-category-combatant_status_certificate').should('be.visible');
        cy.getBySel('photo-category-criminal_record_certificate').should('exist');
        cy.getBySel('photo-category-id_card_reverse').should('exist');
        cy.getBySel('photo-category-id_card_front').should('exist');
        cy.getBySel('photo-category-residence').should('exist');
      });

      it('should display button submit', () => {
        cy.getBySel('photo-control-btn-submit').should('exist');
      });
    });

    describe('if ticket has status clarification', () => {
      const activityLogs = [
        {
          status: TicketStatus.CLARIFICATION,
          actual_from: 1_733_338_970,
          transferred_by_account_id: '',
          transferred_by_full_name: '',
          comment: 'need_photo_without_glasses',
          clarification_details: {
            comment: 'need additional photos',
          },
        },
      ];

      const driverPhotoControlData = {
        ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
        deadline_to_send: 1_735_793_865,
        block_immediately: false,
        status: TicketStatus.CLARIFICATION,
        reasons: [DriverPhotoControlCreatingReason.AFTER_FIRST_ORDERS],
        reason_comment: '',
      };

      beforeEach(() => {
        driverDetails.apply({
          name: 'ok',
          props: {
            firstName: 'Водій',
            lastName: 'Новий',
            photo_control: driverPhotoControlData,
          },
        });

        driverPhotoControl.apply({
          name: 'ok',
          props: { status: TicketStatus.CLARIFICATION, activity_log: activityLogs },
        });
        cy.reload();
      });

      it('should display photo control reason if status clarification', () => {
        cy.getBySel('photo-control-reason-panel-clarification').should('be.visible');
        cy.getBySel('photo-control-reason-panel-draft').should('not.exist');
        cy.getBySel('ticket-reason')
          .should('be.visible')
          .contains('Потрібне кольорове фото без окулярів та головного убору');
        cy.getBySel('ticket-reason-custom-comment').should('be.visible').contains('need additional photos');
      });
    });
  });
}
