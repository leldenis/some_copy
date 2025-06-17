import { BlockedListStatusReason } from '@constant';
import {
  DriverHistoryChange,
  DriverHistoryChangeItemDetailsDto,
  DriverHistoryChangeItemDto,
  HistoryInitiatorType,
} from '@data-access';

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

function driverHistoryList(changeType: DriverHistoryChange): DriverHistoryChangeItemDto[] {
  fleetChangeHistoryIntercept = new FleetDriverChangesHistoryIntercept(
    driverId,
    `cursor=0&limit=20&fleetId=829492c9-29d5-41df-8e9b-14a407235ce1&changeType=${changeType}`,
  );
  return [
    {
      id: '103e6449-bb66-4f71-846d-f5b9e89cb8fe',
      has_additional_data: true,
      change_type: changeType,
      occurred_at: 1_684_492_209,
      linked_entities: {},
      initiator: {
        display_name: 'UklonManager',
        type: HistoryInitiatorType.UKLON_MANAGER,
        account_id: '98c79500-3486-4197-b8e8-248fd44f02e2',
      },
    },
  ];
}

function checkProfileChangedDetails(): void {
  it('should have Toggle cell', () => {
    cy.getBySel('cell-toggle-0').should('exist').should('be.visible');
  });

  it('should have additional data', () => {
    cy.getBySel('history-event-panel-ProfileChanged-0').should('exist').click();
    cy.getBySel('history-additional-info').should('exist');
  });

  it('should have changed Field name, Old value and New value label', () => {
    cy.getBySel('cell-toggle-0').should('be.visible').click();
    cy.getBySel('history-changed-field-label').should('exist').should('contain', 'Поле');

    cy.getBySel('cell-toggle-0').should('be.visible').click();
    cy.getBySel('history-old-value-label').should('exist').should('contain', 'Було');

    cy.getBySel('cell-toggle-0').should('be.visible').click();
    cy.getBySel('history-new-value-label').should('exist').should('contain', 'Стало');
  });

  it('[8013] should display disability types in additional panel', () => {
    fleetDriverIntFleetDriverChangesHistoryDetails.apply({
      name: 'ok',
      props: {
        details: {
          old_disability_types: ['Deaf', 'HardOfHearing', 'SpeechImpairments', 'MovementDisorders'],
          new_disability_types: [],
        },
      },
    });
    cy.getBySel('cell-toggle-0').should('be.visible').click();
    cy.getBySel('history-old-value')
      .should('exist')
      .should('contain', 'Не чує')
      .should('contain', 'Погано чує')
      .should('contain', 'Має порушення мовлення')
      .should('contain', 'Має порушення рухових функцій');
    cy.getBySel('history-new-value').should('exist').should('contain', 'Без особливостей');
  });
}

function B2BSplitChangedDetails(eventType: string): void {
  it('should have Toggle cell', () => {
    cy.getBySel('cell-toggle-0').should('exist').should('be.visible');
  });

  it('should have additional data', () => {
    cy.getBySel(`history-event-panel-${eventType}-0`).should('exist').click();
    cy.getBySel('history-additional-info').should('exist');
  });

  it('should contain fields', () => {
    cy.getBySel(`history-event-panel-${eventType}-0`).click();
    cy.getBySel('history-old-value-label')
      .should('contain', 'Було')
      .and('have.css', 'color')
      .then((color) => {
        expect(color).to.eq('rgb(233, 114, 114)');
      });
    cy.getBySel('history-old-value').should('contain', 'Раз на добу (по балансу парку)');

    cy.getBySel('history-new-value-label')
      .should('contain', 'Стало')
      .and('have.css', 'color')
      .then((color) => {
        expect(color).to.eq('rgb(51, 204, 161)');
      });
    cy.getBySel('history-new-value').should('contain', 'По кожному замовленню (по балансу водія)');
  });
}

function blockedDetails(): void {
  it('should have red color', () => {
    cy.getBySel('cell-Blocked-0')
      .should('have.css', 'color')
      .then((color) => {
        expect(color).to.eq('rgb(233, 114, 114)');
      });
  });

  it('should have fields', () => {
    cy.getBySel('history-event-panel-Blocked-0').click();
    cy.getBySel('history-product-disabled-label')
      .should('contain', 'Причина')
      .and('have.css', 'color')
      .then((color) => {
        expect(color).to.eq('rgb(233, 114, 114)');
      });

    cy.getBySel('history-product-disabled-reason').should('contain', 'Фотоконтроль не пройдено');
  });
}

function financeProfileChangedDetails(): void {
  beforeEach(() => {
    cy.getBySel('cell-FinanceProfileChanged-0').click();
  });

  it('details', () => {
    cy.getBySel('history-details-disabled').should('contain', 'Вимкнуті');
  });
  it('details', () => {
    cy.getBySel('history-details-value').should('contain', 'Отримання грошей на карту');
  });
}

function withoutDetails(): void {
  it('should have Event type cell', () => {
    cy.getBySel('cell-toggle-0').should('not.exist');
  });
}

interface Case {
  eventType: DriverHistoryChange;
  eventLabel: string;
  checkDetails?: () => void;
  eventDetails?: DriverHistoryChangeItemDetailsDto;
}

const cases: Case[] = [
  {
    eventType: DriverHistoryChange.ADDED_TO_FLEET,
    eventLabel: 'Додано в автопарк',
    checkDetails: () => withoutDetails(),
  },
  {
    eventType: DriverHistoryChange.B2B_SPLIT_ADJUSTMENT_CHANGED,
    eventLabel: 'Зміна типу корегування',
    checkDetails: () => B2BSplitChangedDetails('B2BSplitAdjustmentChanged'),
    eventDetails: { old_value: 'TimeRange', current_value: 'PerSplit' },
  },
  {
    eventType: DriverHistoryChange.B2B_SPLIT_DISTRIBUTION_CHANGED,
    eventLabel: 'Зміна методу сплітування',
    checkDetails: () => B2BSplitChangedDetails('B2BSplitDistributionChanged'),
    eventDetails: { old_value: 'TimeRange', current_value: 'PerSplit' },
  },
  {
    eventType: DriverHistoryChange.BLACK_LIST_CLEARED,
    eventLabel: 'ЧС очищено',
    checkDetails: () => withoutDetails(),
    eventDetails: { old_value: 'TimeRange', current_value: 'PerSplit' },
  },
  {
    eventType: DriverHistoryChange.BLOCKED,
    eventLabel: 'Заблоковано',
    checkDetails: () => blockedDetails(),
    eventDetails: { reason: BlockedListStatusReason.PHOTO_CONTROL },
  },
  {
    eventType: DriverHistoryChange.FINANCE_PROFILE_CHANGED,
    eventLabel: 'Фінансові налаштування',
    checkDetails: () => financeProfileChangedDetails(),
    eventDetails: { new_order_payment_to_card: false },
  },
  {
    eventType: DriverHistoryChange.PHONE_CHANGED,
    eventLabel: 'Номер телефону змінено',
    checkDetails: () => withoutDetails(),
  },
  {
    eventType: DriverHistoryChange.REGISTERED,
    eventLabel: 'Реєстрація',
    checkDetails: () => withoutDetails(),
  },
  {
    eventType: DriverHistoryChange.PROFILE_CHANGED,
    eventLabel: 'Зміна даних водія',
    checkDetails: () => checkProfileChangedDetails(),
    eventDetails: { new_locale: 'En', old_locale: 'Ru' },
  },
];

if (isMockingData()) {
  cases.forEach(({ eventType, eventLabel, eventDetails, checkDetails }) => {
    describe(`Check ${eventType} event`, () => {
      const eventTypeValue = Object.keys(DriverHistoryChange).find(
        (k) => DriverHistoryChange[k as keyof typeof DriverHistoryChange] === eventType,
      );

      beforeEach(() => {
        fleetDriverIntercept.apply({ name: 'ok' });
        fleetChangeHistoryIntercept.apply({
          name: 'ok',
          props: {
            items: driverHistoryList(eventType),
          },
        });
        fleetDriverIntFleetDriverChangesHistoryDetails.apply({
          name: 'ok',
          props: { details: eventDetails, change_type: eventType },
        });
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

        cy.loginWithSession('driverDetailsTabs');
        cy.visit('/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f#history');
        cy.getBySel('history-type-control').should('exist').click();
        cy.getBySel(`history-type-option-${eventTypeValue}`).should('exist').click();
      });

      it(`should have ${eventTypeValue} event`, () => {
        cy.getBySel(`history-event-panel-${eventType}-0`).should('exist');
      });

      it('should have Event type cell', () => {
        cy.getBySel(`cell-${eventType}-0`).should('exist').should('contain', eventLabel);
        cy.getBySel(`cell-no-data-${eventType}-0`).should('not.exist');
      });

      checkDetails();
    });
  });
}
