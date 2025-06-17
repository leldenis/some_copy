import {
  BlockedListStatusValue,
  DriverPhotoControlCreatingReason,
  DriverStatus,
  KarmaGroup,
  TicketStatus,
  VehicleAccessType,
} from '@constant';
import { DriverFilter, DriverOrderFilterTypeVersion, FleetDriversItemDto, WithdrawalType } from '@data-access';

import { UklonGarageApplicationsIntercept } from '../../../support/interceptor';
import { fleetDriverListIntercept } from '../../../support/interceptor/drivers';
import { driverActiveFiltersIntercept } from '../../../support/interceptor/drivers/active-filters';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../support/interceptor/drivers/photo-control/has-active-tickets';
import { IndividualEntrepreneursIntercept } from '../../../support/interceptor/finance/individual-entrepreneus';
import { fleetVehicleImagesIntercept } from '../../../support/interceptor/vehicles';
import { FleetVehicleDetailsIntercept } from '../../../support/interceptor/vehicles/details';
import { FleetVehicleProductsIntercept } from '../../../support/interceptor/vehicles/details/vehicle-products';
import { isMockingData } from '../../../support/utils';

const { _: lodash } = Cypress;
const vehicleId = '3933d650-e07d-49fb-be3c-75b82167ec51';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const driversList: FleetDriversItemDto[] = [
  {
    id: '4a1a6336-3e24-4087-8f68-52898c390aee',
    first_name: 'First',
    last_name: 'Last',
    phone: '380552534001',
    signal: 253_401,
    rating: 500,
    karma: {
      group: KarmaGroup.FIRST_PRIORITY,
      value: 100,
    },
    status: DriverStatus.WORKING,
    selected_vehicle: {
      vehicle_id: vehicleId,
      license_plate: 'AQA0001',
      fleet_id: '29e180d5-6c83-4397-ba77-9a936b72a24a',
      make: 'Nissan',
      model: 'Logan',
    },
    block_status: {
      value: BlockedListStatusValue.ACTIVE,
    },
    photo_control: {
      ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
      deadline_to_send: Date.now() + WEEK_MS,
      block_immediately: false,
      status: TicketStatus.DRAFT,
      reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
      reason_comment: 'some photo missed',
    },
  },
  {
    id: '62959ff4-86d8-46a1-88fe-15afe5729f29',
    first_name: 'First',
    last_name: 'Last',
    phone: '380552534001',
    signal: 253_401,
    rating: 500,
    karma: {
      group: KarmaGroup.FIRST_PRIORITY,
      value: 100,
    },
    status: DriverStatus.WORKING,
    block_status: {
      value: BlockedListStatusValue.BLOCKED,
    },
    photo_control: {
      ticket_id: 'ac667679-9ac6-43cb-9628-83361ea2f6c1',
      deadline_to_send: Date.now() - WEEK_MS,
      block_immediately: true,
      status: TicketStatus.CLARIFICATION,
      reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
      reason_comment: 'some photo missed',
    },
  },
  {
    id: '2419c19c-529f-4d1d-92f4-93f0a95976a6',
    first_name: 'First',
    last_name: 'Last',
    phone: '380552535001',
    signal: 253_501,
    rating: 500,
    karma: {
      group: KarmaGroup.FIRST_PRIORITY,
      value: 100,
    },
    status: DriverStatus.WORKING,
    block_status: {
      value: BlockedListStatusValue.ACTIVE,
    },
    photo_control: {
      ticket_id: '5146f3c1-206b-4a61-bd5b-59bb717c3385',
      deadline_to_send: Date.now() + WEEK_MS,
      block_immediately: false,
      status: TicketStatus.SENT,
      reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
      reason_comment: 'some photo missed',
    },
  },
];
const fleetVehicleDetails = new FleetVehicleDetailsIntercept('*', vehicleId);
const individualEntrepreneurs = new IndividualEntrepreneursIntercept('*', true);
const productsIntercept = new FleetVehicleProductsIntercept('*', '*');

function openPage(
  responseData: { count: number; total_count?: number; drivers?: FleetDriversItemDto[] },
  url: string,
): void {
  if (isMockingData()) {
    fleetDriverListIntercept.apply({ name: 'ok', props: responseData });
  }
  cy.clearLocalStorage();
  cy.loginWithSession('DriverList');
  cy.visit(url);
}

describe('Drivers list', () => {
  const paginationSize = Cypress.env('paginationSize');
  const garageIntercept = new UklonGarageApplicationsIntercept('*');
  const hasActiveTicketsIntercept = new DriverPhotoControlHasActiveTicketsIntercept('*');

  beforeEach(() => {
    garageIntercept.apply({ name: 'ok' });
    hasActiveTicketsIntercept.apply({ name: 'ok' });
  });

  describe('When a fleet has drivers', () => {
    beforeEach(() => {
      openPage({ count: 30, total_count: 49 }, '/');
      cy.getBySel('menu-toggle-btn').should('be.visible');
      cy.getBySel('side-nav-menu-drivers').as('link');
      cy.get('@link').click();
    });

    it('[5071] should navigate to driver list', () => {
      cy.url().should('includes', 'workspace/drivers');
    });

    it('[5071] should not be empty', () => {
      cy.getBySel('no-data').should('not.exist');
    });

    if (isMockingData()) {
      it(`[PF-238] should have ${paginationSize} records per page`, () => {
        cy.get('[data-cy^="row-"]').should('have.length', paginationSize);
      });

      it('[PF-239] drivers should be sorted by full name', () => {
        cy.getBySel('mat-paginator').contains(`1 - ${paginationSize} з 49`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-function-return-type
        const toStrings = (cells: any) => lodash.map(cells, 'textContent');
        cy.getBySel('cell-FullName')
          .then(toStrings)
          .then((fullNames) => {
            const sorted = lodash.sortBy(fullNames, 'ua');
            expect(fullNames, 'table is sorted by full name').to.deep.equal(sorted);
          });
      });

      describe('header row', () => {
        it('[C462967] should have a header', () => {
          cy.getBySel('header-row').should('exist');
        });

        describe('header cells', () => {
          it('[C462967] should have a full name cell', () => {
            cy.getBySel('header-cell-FullName').should('contain.text', "Прізвище та ім'я");
          });

          it('[C462967] should have a phone cell', () => {
            cy.getBySel('header-cell-Phone').should('contain.text', 'Номер телефону');
          });

          it('[C462967] should have a signal cell', () => {
            cy.getBySel('header-cell-Signal').should('contain.text', 'Позивний');
          });

          it('[C462967] should have a rating cell', () => {
            cy.getBySel('header-cell-Rating').should('contain.text', 'Рейтинг');
          });

          it('[C462967] should have a karma cell', () => {
            cy.getBySel('header-cell-Karma').should('contain.text', 'Uklon карма');
          });

          it('[C462967] should have a vehicle cell', () => {
            cy.getBySel('header-cell-Vehicle').should('contain.text', 'На авто');
          });
        });
      });

      describe('first row', () => {
        it('[C462967] should have a row', () => {
          cy.getBySel('row-0').should('exist');
        });
      });
    }
  });

  if (isMockingData()) {
    describe('Vehicle cell', () => {
      beforeEach(() => {
        fleetVehicleImagesIntercept.apply({ name: 'ok' });
        individualEntrepreneurs.apply({ name: 'ok', props: { withdrawal_type: WithdrawalType.PAYMENT_CARD } });
        productsIntercept.apply({ name: 'ok' });
        cy.intercept('api/fleets/*/vehicles/*/access-to-drivers', {
          statusCode: 200,
          body: { access_type: VehicleAccessType.NOBODY, drivers: [] },
        });

        openPage({ count: 1, drivers: driversList }, 'workspace/drivers');
      });

      it('should display vehicle', () => {
        cy.getBySel('row-0').within(() => {
          cy.getBySel('cell-Vehicle').should('contain', 'Nissan Logan');
        });
      });

      it('should display text when no selected vehicle', () => {
        cy.getBySel('row-1').within(() => {
          cy.getBySel('cell-Vehicle').should('contain', 'Авто не обрано');
        });
      });

      it('should show pop-up on click unlink icon', () => {
        cy.getBySel('row-0').within(() => {
          cy.getBySel('cell-button-Unlink').click();
        });
        cy.getBySel('unlink-driver-vehicle-modal').should('be.visible');
      });

      it('should open vehicle page', () => {
        fleetVehicleDetails.apply({ name: 'ok', props: { id: vehicleId } });
        cy.getBySel('row-0').within(() => {
          cy.getBySel('vehiclePlate-Link').click();
        });
        cy.url().should('includes', vehicleId);
      });
    });

    describe('Driver status icons', () => {
      beforeEach(() => {
        openPage({ count: 2, drivers: driversList }, 'workspace/drivers');
      });

      it('should display gray photo-control', () => {
        cy.getBySel('row-0').within(() => {
          cy.getBySel('icon-photo-control-isBlocked-false').should('be.visible');
        });
      });

      it('should display red photo-control', () => {
        cy.getBySel('row-1').within(() => {
          cy.getBySel('icon-photo-control-isBlocked-true').should('be.visible');
        });
      });

      const testCases = [
        {
          ticketStatus: TicketStatus.DRAFT,
          title: 'Даному водію необхідно пройти фотоконтроль',
        },
        {
          ticketStatus: TicketStatus.CLARIFICATION,
          title: 'Фотоконтроль по даному водію потребує уточнення',
        },
      ];
      testCases.forEach(({ ticketStatus, title }) => {
        it(`[7183] should have photo control tooltip for status ${ticketStatus}`, () => {
          const photoControl = {
            ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
            deadline_to_send: 1_735_793_865,
            block_immediately: false,
            status: ticketStatus,
            reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
            reason_comment: 'some photo missed',
          };

          fleetDriverListIntercept.apply({ name: 'ok', props: { count: 1, photo_control: photoControl } });
          cy.reload();
          cy.getBySel('photo-control-icon').should('be.visible').click();

          cy.getBySel('photo-control-tooltip-title').should('be.exist').contains(title);
        });
      });

      it('should display red flag for blocked driver', () => {
        cy.getBySel('row-1').within(() => {
          cy.getBySel('icon-driver-blocked').should('be.visible');
        });
      });

      it('should not display photo-control icon for Sent status', () => {
        cy.getBySel('row-2').within(() => {
          cy.getBySel('icon-photo-control-isBlocked-true').should('not.exist');
        });
      });
    });

    describe('Empty state', () => {
      beforeEach(() => {
        openPage({ count: 0 }, 'workspace/drivers');
      });

      it('should display empty state', () => {
        cy.getBySel('no-data').should('be.visible');
      });
    });

    if (isMockingData()) {
      describe('Driver active filters', () => {
        const filters: DriverFilter[][] = [
          [DriverFilter.OFFER],
          [DriverFilter.BROADCAST, DriverFilter.LOOP_FILTER],
          [DriverFilter.BROADCAST, DriverFilter.LOOP_FILTER, DriverFilter.OFFER],
          [],
          [],
        ];

        const drivers = Array.from({ length: 5 }).map((_, index) => {
          return {
            id: `${index}`,
            first_name: 'First',
            last_name: 'Last',
            phone: '380552534001',
            signal: 253_401,
            rating: 500,
            karma: { group: KarmaGroup.FIRST_PRIORITY, value: 100 },
            status: DriverStatus.WORKING,
            block_status: { value: BlockedListStatusValue.ACTIVE },
            active_driver_filters: filters[index],
            is_online: index < 4,
          };
        });

        it('[8216] should display active filters', () => {
          openPage({ count: 5, total_count: 5, drivers }, '/workspace/drivers');

          cy.getBySel('cell-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтр (авто)');
            });

          cy.getBySel('cell-Filters')
            .eq(1)
            .within(() => {
              cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл)');
            });

          cy.getBySel('cell-Filters')
            .eq(2)
            .within(() => {
              cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-link').should('exist').should('contain', 'Фільтри (ефір, цикл, авто)');
            });

          cy.getBySel('cell-Filters')
            .eq(3)
            .within(() => {
              cy.getBySel('active-filter').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-link').should('not.exist');
            });

          cy.getBySel('cell-Filters')
            .eq(4)
            .within(() => {
              cy.getBySel('active-filter').should('exist').should('contain', 'Неактивний');
              cy.getBySel('active-filter-link').should('not.exist');
            });
        });

        it('[8223] should display active filters on mobile', () => {
          cy.viewport('iphone-xr');
          openPage({ count: 5, total_count: 5, drivers }, '/workspace/drivers');

          cy.getBySel('expand-toggle').eq(0).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter-mobile').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-mobile-link').should('exist').should('contain', 'Фільтр (авто)');
            });

          cy.getBySel('expand-toggle').eq(1).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(1)
            .within(() => {
              cy.getBySel('active-filter-mobile').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-mobile-link').should('exist').should('contain', 'Фільтри (ефір, цикл)');
            });

          cy.getBySel('expand-toggle').eq(2).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(2)
            .within(() => {
              cy.getBySel('active-filter-mobile').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-mobile-link').should('exist').should('contain', 'Фільтри (ефір, цикл, авто)');
            });

          cy.getBySel('expand-toggle').eq(3).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(3)
            .within(() => {
              cy.getBySel('active-filter-mobile').should('exist').should('contain', 'ефір');
              cy.getBySel('active-filter-mobile-link').should('not.exist');
            });

          cy.getBySel('expand-toggle').eq(4).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(4)
            .within(() => {
              cy.getBySel('active-filter-mobile').should('exist').should('contain', 'Неактивний');
              cy.getBySel('active-filter-mobile-link').should('not.exist');
            });
        });

        it('[8217] should open active filters dialog', () => {
          driverActiveFiltersIntercept.apply({
            name: 'ok',
            props: { count: 1, filters: [DriverFilter.LOOP_FILTER], enabled: { tariff: true } },
          });
          openPage({ count: 5, total_count: 5, drivers }, '/workspace/drivers');

          cy.viewport('iphone-xr');

          cy.getBySel('expand-toggle').eq(0).should('exist').click();
          cy.getBySel('cell-mobile-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter-mobile-link').should('exist').click();
            });

          cy.getBySel('driver-filters-details-dialog').should('exist');
          cy.getBySel('driver-filters-details-dialog-close-btn').should('exist').click();
          cy.getBySel('driver-filters-details-dialog').should('not.exist');
          cy.getBySel('expand-toggle').eq(0).should('exist').click();

          cy.viewport(Cypress.config().viewportWidth, Cypress.config().viewportHeight);

          cy.getBySel('cell-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter-link').should('exist').click();
            });
          cy.getBySel('driver-filters-details-dialog').should('exist');

          cy.getBySel('filter-new-properties').should('not.exist');

          cy.getBySel('driver-filter-old-format').should('contain', 'Старий формат');
          cy.getBySel('filter-name').should('contain', 'OfferLoopFilter').should('contain', 'Цикл');
          cy.getBySel('filter-time').should('contain', 'Від 02.04.2025 12:49');
          cy.getBySel('filter-distance').should('contain', 'Радіус').should('contain', '12.9 км');
          cy.getBySel('filter-payment-type').should('contain', 'Тип оплати');
          cy.getBySel('filter-payment-type').within(() => {
            cy.get('.mat-icon')
              .eq(0)
              .should('exist')
              .should('have.attr', 'data-mat-icon-name')
              .should('contain', 'i-cash');

            cy.get('.mat-icon')
              .eq(1)
              .should('exist')
              .should('have.attr', 'data-mat-icon-name')
              .should('contain', 'i-card');
          });
          cy.getBySel('filter-min-cost').should('contain', 'Мін. варітсть').should('contain', '₴ 1.00');
          cy.getBySel('filter-min-distance').should('contain', 'Км у мінімалці').should('contain', '2 км');
          cy.getBySel('filter-cost-per-km').should('contain', 'Ціна 1 км, місто').should('contain', '₴ 3.00');
          cy.getBySel('filter-cost-per-km-suburbs')
            .should('contain', 'Ціна 1 км, передмістя')
            .should('contain', '₴ 4.00');
          cy.getBySel('filter-source-sectors').should('contain', 'Звідки').should('contain', 'АКАДЕММІСТЕЧКО');
          cy.getBySel('filter-destination-sectors').should('contain', 'Куди').should('contain', 'АКАДЕММІСТЕЧКО');

          cy.get('body').click(0, 0);
          cy.getBySel('driver-filters-details-dialog').should('not.exist');
        });

        it('[8287] should have new filter data', () => {
          driverActiveFiltersIntercept.apply({
            name: 'ok',
            props: {
              count: 1,
              filters: [DriverFilter.LOOP_FILTER],
              enabled: { cost: true, locality: false },
              type_version: DriverOrderFilterTypeVersion.V2,
            },
          });
          openPage({ count: 5, total_count: 5, drivers }, '/workspace/drivers');

          cy.getBySel('cell-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter-link').should('exist').click();
            });

          cy.getBySel('filter-old-properties').should('not.exist');

          cy.getBySel('filter-min-cost-new').should('contain', 'Мін. варітсть').should('contain', '₴ 5.00');
          cy.getBySel('filter-cost-per-km-new').should('contain', 'Мін. ціна за 1 км').should('contain', '₴ 6.00');
          cy.getBySel('filter-only-city')
            .should('contain', 'Лише місто')
            .within(() => {
              cy.get('.mat-icon').should('contain', 'check_circle');
            });

          driverActiveFiltersIntercept.apply({
            name: 'ok',
            props: {
              count: 1,
              filters: [DriverFilter.LOOP_FILTER],
              enabled: { cost: true, locality: true },
              type_version: DriverOrderFilterTypeVersion.V2,
            },
          });
          openPage({ count: 5, total_count: 5, drivers }, '/workspace/drivers');

          cy.getBySel('cell-Filters')
            .eq(0)
            .within(() => {
              cy.getBySel('active-filter-link').should('exist').click();
            });

          cy.getBySel('filter-only-city').should('not.exist');
        });
      });
    }
  }
});
