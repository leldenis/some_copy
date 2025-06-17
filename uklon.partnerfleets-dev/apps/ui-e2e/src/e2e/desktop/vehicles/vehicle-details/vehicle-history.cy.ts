import { HistoryInitiatorType, VehicleHistoryType } from '@data-access';

import { IndividualEntrepreneursIntercept } from '../../../../support/interceptor/finance/individual-entrepreneus';
import { fleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { vehicleAccessToDriversIntercept } from '../../../../support/interceptor/vehicles/access-to-drivers';
import { FleetVehicleDetailsIntercept } from '../../../../support/interceptor/vehicles/details';
import { fleetVehicleChangesHistoryDetailsIntercept } from '../../../../support/interceptor/vehicles/details/changes-history-details';
import { FleetVehicleHistoryIntercept } from '../../../../support/interceptor/vehicles/details/vehicle-history';
import { isMockingData } from '../../../../support/utils';

const vehicleId = 'ebe250ef-25fe-4c30-bb52-1a9bc495fca6';
const fleetId = '829492c9-29d5-41df-8e9b-14a407235ce1';

const fleetVehicleHistory = new FleetVehicleHistoryIntercept(fleetId, vehicleId, '');
const fleetVehicleHistoryFiltered = new FleetVehicleHistoryIntercept(fleetId, vehicleId, 'AccessToVehicleChanged');
const fleetVehicleDetails = new FleetVehicleDetailsIntercept(fleetId, vehicleId);
const individualEntrepreneursIntercept = new IndividualEntrepreneursIntercept('*', true);

const eventProductAvailabilityChanged = [
  {
    id: 'e18ffe91-ec9f-4573-a8bb-5630d76b72ba',
    change_type: VehicleHistoryType.PRODUCT_AVAILABILITY_CHANGED,
    occurred_at: 1_725_884_015,
    initiator: {
      display_name: 'System',
      type: HistoryInitiatorType.SYSTEM,
      account_id: '',
    },
    linked_entities: {},
    has_additional_data: true,
  },
];
const eventAccessToVehicleChanged = [
  {
    id: '90f99a87-925b-4c6e-8c4e-b8e6958b1b27',
    change_type: VehicleHistoryType.ACCESS_TO_VEHICLE_CHANGED,
    occurred_at: 1_725_884_015,
    initiator: {
      display_name: 'System',
      type: HistoryInitiatorType.SYSTEM,
      account_id: '',
    },
    linked_entities: {},
    has_additional_data: true,
  },
];

describe('Vehicle Product', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetVehicleDetails.apply({ name: 'ok', props: { id: vehicleId, license_plate: 'AQA7297' } });
      fleetVehicleHistory.apply({ name: 'ok', props: { items: eventProductAvailabilityChanged } });
      fleetVehicleHistoryFiltered.apply({ name: 'ok', props: { items: eventAccessToVehicleChanged } });
      individualEntrepreneursIntercept.apply({ name: 'ok', props: { entrepreneur: [] } });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetVehicleChangesHistoryDetailsIntercept.apply({ name: 'ok' });
      vehicleAccessToDriversIntercept.apply({ name: 'ok' });
    }

    cy.loginWithSession('vehicleProduct');
    cy.visit(`/workspace/vehicles/details/${vehicleId}#history`);
  });

  it('[5535] should display history list', () => {
    cy.getBySel('vehicle-history-table').should('exist');
  });

  it('[5536] should filter by type', () => {
    cy.getBySel('vehicle-history-filter').click();
    cy.getBySel('AccessToVehicleChanged-filter').click();
    cy.getBySel('90f99a87-925b-4c6e-8c4e-b8e6958b1b27-event-type').should('contain', 'Доступність до авто змінено');
  });

  it('[5537] should open history details', () => {
    cy.getBySel('e18ffe91-ec9f-4573-a8bb-5630d76b72ba-event-type').click();
    cy.getBySel('e18ffe91-ec9f-4573-a8bb-5630d76b72ba-event-details').should('exist');
  });
});
