import { TicketStatus, VehiclePhotoControlCreatingReason } from '@constant';
import { VehicleDetailsPhotoControlDto } from '@data-access';
import { PHOTO_CONTROL_STATUS_STYLING } from '@ui/modules/vehicles/consts';

import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { vehicleAccessToDriversIntercept } from '../../../../support/interceptor/vehicles/access-to-drivers';
import { FleetVehicleDetailsIntercept } from '../../../../support/interceptor/vehicles/details';
import { FleetVehiclePhotoControlIntercept } from '../../../../support/interceptor/vehicles/details/vehicle-photo-control';
import { isMockingData } from '../../../../support/utils';

if (isMockingData()) {
  const fleetId = '*';
  const vehicleId = '0ca2ab49-e064-4f14-9ed7-09e436034bab';
  const ticketId = 'd413f4b4-3e76-4424-a6a3-e539866a3431b';

  const deadlines = [1_668_675_444, Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000)];
  const logActivityClarification = [
    {
      status: TicketStatus.DRAFT,
      actual_from: 1_668_675_443,
      transferred_by_account_id: '',
      transferred_by_full_name: '',
      comment: 'Api',
    },
    {
      status: TicketStatus.CLARIFICATION,
      actual_from: 1_737_539_120,
      transferred_by_account_id: '',
      transferred_by_full_name: '',
      comment: 'low_quality_photo',
      clarification_details: {
        comment: 'Потрібно переробити',
        photo_clarification_reasons: {},
      },
    },
  ];

  const createPhotoControl = (ticketStatus: TicketStatus, deadline: number): VehicleDetailsPhotoControlDto => ({
    ticket_id: ticketId,
    deadline_to_send: deadline,
    status: ticketStatus,
    block_immediately: false,
    reasons: [VehiclePhotoControlCreatingReason.BY_VEHICLE_MODEL],
    reason_comment: 'Потрібен контроль',
  });
  const fleetVehicleDetails = new FleetVehicleDetailsIntercept(fleetId, vehicleId);
  const fleetVehiclePhotoControlIntercept = new FleetVehiclePhotoControlIntercept(fleetId);
  const individualEntrepreneursIntercept = new IndividualEntrepreneursIntercept('*', true);

  describe('Vehicle-details-photo-control', () => {
    beforeEach(() => {
      fleetVehicleDetails.apply({
        name: 'ok',
        props: {
          id: vehicleId,
          photo_control: createPhotoControl(TicketStatus.BLOCKED_BY_MANAGER, deadlines[0]),
        },
      });
      fleetVehiclePhotoControlIntercept.apply({
        name: 'ok',
        props: {
          deadline_to_send: deadlines[1],
          activity_log: [],
          status: TicketStatus.BLOCKED_BY_MANAGER,
        },
      });
      individualEntrepreneursIntercept.apply({ name: 'ok', props: { entrepreneur: [] } });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      vehicleAccessToDriversIntercept.apply({ name: 'ok' });
      cy.intercept('GET', 'api/fleets/*/vehicles/*/product-configurations', { statusCode: 200, body: { items: [] } });

      cy.loginWithSession('fleetWallet');
      cy.visit(`/workspace/vehicles/details/${vehicleId}`);
    });

    const testCases = [
      {
        testCaseId: '5559',
        ticketStatus: TicketStatus.DRAFT,
        deadline: deadlines[0],
        field: 'reason',
        expectedText: 'Перевірка моделі авто у сервісі',
      },
      {
        testCaseId: '5560',
        ticketStatus: TicketStatus.DRAFT,
        deadline: deadlines[1],
        field: 'comment',
        expectedText: 'Потрібен контроль',
      },
      {
        testCaseId: '5564',
        ticketStatus: TicketStatus.CLARIFICATION,
        deadline: deadlines[0],
        logActivity: logActivityClarification,
        field: 'reason',
        expectedText: 'Фото низької якості.',
      },
      {
        testCaseId: '5566',
        ticketStatus: TicketStatus.CLARIFICATION,
        deadline: deadlines[1],
        logActivity: logActivityClarification,
        field: 'comment',
        expectedText: 'Потрібно переробити',
      },
    ];

    testCases.forEach(({ testCaseId, ticketStatus, deadline, logActivity, field, expectedText }) => {
      describe(`With status: ${ticketStatus} and deadline: ${deadline}`, () => {
        beforeEach(() => {
          fleetVehicleDetails.apply({
            name: 'ok',
            props: {
              id: vehicleId,
              photo_control: createPhotoControl(ticketStatus, deadline),
            },
          });
          fleetVehiclePhotoControlIntercept.apply({
            name: 'ok',
            props: { deadline_to_send: deadline, activity_log: logActivity, status: ticketStatus },
          });

          cy.reload();
        });

        it(`[${testCaseId}] Check ${ticketStatus} ticket ${field} field`, () => {
          cy.getBySel('info-panel-btn').should('be.visible').click();
          cy.getBySel(`photo-control-${field}`).should('contain', expectedText);
        });
      });
    });

    describe('BlockedByManager vehicle photo control', () => {
      it('[7652] should display same status for Review and BlockedByManager statuses', () => {
        cy.getBySel('info-panel-btn').should('not.exist');
        cy.getBySel('vehicle-photo-control-panel')
          .should('exist')
          .should('be.visible')
          .should('have.class', PHOTO_CONTROL_STATUS_STYLING[TicketStatus.REVIEW].color);
        cy.getBySel('vehicle-photo-control-panel-status').should('be.visible').should('contain', 'На перевірці');
      });
    });
  });
}
