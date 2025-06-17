import { DriverHistoryChange, DriverHistoryChangeItemDto, HistoryInitiatorType } from '@data-access';

import { fleetDriverDenyListIntercept, FleetDriverIntercept } from '../../../../support/interceptor/drivers';
import { FleetDriverChangesHistoryIntercept } from '../../../../support/interceptor/drivers/changes-history';
import { FleetDriverChangesHistoryDetailsIntercept } from '../../../../support/interceptor/drivers/changes-history-details';
import { fleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { fleetDriverRestrictionsIntercept } from '../../../../support/interceptor/drivers/restrictions';
import { FleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverId = '*';

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverId);
let fleetChangeHistoryIntercept = new FleetDriverChangesHistoryIntercept(
  driverId,
  'cursor=0&limit=20&fleetId=829492c9-29d5-41df-8e9b-14a407235ce1&changeType=',
);

const fleetDriverIntFleetDriverChangesHistoryDetails = new FleetDriverChangesHistoryDetailsIntercept(
  driverId,
  '*',
  '*',
);
const driverRideConditions = new FleetDriverRideConditionsIntercept(fleetId, driverId);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept('*');

function driverHistoryList(
  responeType: DriverHistoryChange,
  queryType: string,
  date: number,
  initiator?: string,
  initiatorType?: HistoryInitiatorType,
  has_additional_data?: boolean,
): DriverHistoryChangeItemDto[] {
  fleetChangeHistoryIntercept = new FleetDriverChangesHistoryIntercept(
    driverId,
    `cursor=0&limit=20&fleetId=829492c9-29d5-41df-8e9b-14a407235ce1&changeType=${queryType}`,
  );
  return [
    {
      id: '103e6449-bb66-4f71-846d-f5b9e89cb8fe',
      has_additional_data: has_additional_data ?? true,
      change_type: responeType,
      occurred_at: date,
      linked_entities: {},
      initiator: {
        display_name: initiator,
        type: initiatorType,
        account_id: '98c79500-3486-4197-b8e8-248fd44f02e2',
      },
    },
  ];
}

describe('Driver details history tab', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetDriverIntercept.apply({ name: 'ok' });
      fleetChangeHistoryIntercept.apply({ name: 'ok', props: { count_items: 5 } });
      driverRideConditions.apply({ name: 'ok' });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    }

    cy.clearLocalStorage();
    cy.loginWithSession('driverDetailsTabs');
    cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#history');
  });

  describe('Driver history event filter', () => {
    it('[5511] should have driver history filter', () => {
      cy.getBySel('history-type-control').should('exist');
    });

    it('[5511] should have 26 options', () => {
      cy.getBySel('history-type-control').should('exist').click();
      cy.get('[role="listbox"] mat-option').should('have.length', 26);
    });
  });

  if (isMockingData()) {
    it('should should have active class for accessibility tab', () => {
      cy.get('.mdc-tab-indicator--active').getBySel('driver-details-tabs-history').should('contain', 'Історія змін');
    });

    it('should have Event type, Role/Author, Occurrence date column', () => {
      cy.getBySel('header-event-type').should('exist').should('contain', 'Тип події');

      cy.getBySel('header-role').should('exist').should('contain', 'Роль').should('contain', 'Автор');

      cy.getBySel('header-date').should('exist').should('contain', 'Дата зміни');
    });

    describe('History events types', () => {
      beforeEach(() => {
        cy.getBySel('history-type-control').should('exist').click();
      });

      describe('Event cell info', () => {
        beforeEach(() => {
          fleetChangeHistoryIntercept.apply({
            name: 'ok',
            props: {
              items: driverHistoryList(
                DriverHistoryChange.PHONE_CHANGED,
                'PhoneChanged',
                1_684_492_209,
                'UklonManager',
                HistoryInitiatorType.UKLON_MANAGER,
              ),
            },
          });
          cy.getBySel('history-type-option-PHONE_CHANGED').should('exist').click();
        });

        it('should have event in list', () => {
          cy.getBySel('history-event-panel-PhoneChanged-0').should('exist').click();
          cy.getBySel('history-event-panel-PhoneChanged-0').should('not.have.class', 'mat-expanded');
        });

        it('should have Event type cell', () => {
          cy.getBySel('cell-PhoneChanged-0').should('exist').should('contain', 'Номер телефону змінено');
        });

        it('should have Role cell', () => {
          cy.getBySel('cell-role-0').should('exist').should('contain', 'Менеджер Уклон');
          cy.getBySel('cell-email-0').should('not.exist');
        });

        it('should have Occurrence date cell', () => {
          cy.getBySel('cell-date-0').should('exist').should('contain', '19.05.2023');
          cy.getBySel('cell-time-0').should('exist').should('contain', '10:30');
        });
      });

      describe('Event with details', () => {
        beforeEach(() => {
          fleetChangeHistoryIntercept.apply({
            name: 'ok',
            props: {
              items: driverHistoryList(
                DriverHistoryChange.PROFILE_CHANGED,
                'ProfileChanged',
                1_684_829_449,
                '404afeyh@aqa.aqa',
              ),
            },
          });
          fleetDriverIntFleetDriverChangesHistoryDetails.apply({
            name: 'ok',
            props: { details: { new_locale: 'En', old_locale: 'Ru' } },
          });
          cy.getBySel('history-type-option-PROFILE_CHANGED').should('exist').click();
        });

        it('should have Role cell', () => {
          cy.getBySel('cell-role-0').should('exist').should('contain', '-');
          cy.getBySel('cell-email-0').should('exist').should('contain', '404afeyh@aqa.aqa');
        });

        it('should have Occurrence cell', () => {
          cy.getBySel('cell-date-0').should('exist').should('contain', '23.05.2023');
          cy.getBySel('cell-time-0').should('exist').should('contain', '08:10');
        });

        it('should have Toggle cell', () => {
          cy.getBySel('cell-toggle-0').should('exist').should('be.visible');
        });

        it('should have additional data', () => {
          cy.getBySel('history-event-panel-ProfileChanged-0').should('exist').click();
          cy.getBySel('history-additional-info').should('exist');
        });

        it('should toggle additional info', () => {
          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-additional-info').should('be.visible');
          cy.getBySel('cell-toggle-0').should('be.visible').click();
          cy.getBySel('history-additional-info').should('not.be.visible');
        });
      });
    });
  }
});
