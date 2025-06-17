import { Restriction, RestrictionReason } from '@constant';

import { DRIVERS } from '../../../../support/config';
import { UklonGarageApplicationsIntercept } from '../../../../support/interceptor';
import {
  fleetDriverDenyListIntercept,
  FleetDriverIntercept,
  FleetDriverListIntercept,
} from '../../../../support/interceptor/drivers';
import { FleetDriverImagesIntercept } from '../../../../support/interceptor/drivers/images';
import { DriverPhotoControlIntercept } from '../../../../support/interceptor/drivers/photo-control/driver-photo-control';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../../support/interceptor/drivers/photo-control/has-active-tickets';
import {
  fleetDriverRestrictionsIntercept,
  FleetDriverRestrictionsIntercept,
} from '../../../../support/interceptor/drivers/restrictions';
import { FleetDriverRideConditionsIntercept } from '../../../../support/interceptor/drivers/ride-conditions';
import { fleetDriverStatisticIntercept } from '../../../../support/interceptor/drivers/statistic';
import { FleetEmployeesWalletIntercept } from '../../../../support/interceptor/finance/employees-wallet';
import { FleetVehicleImagesIntercept } from '../../../../support/interceptor/vehicles';
import { AccountKind, getAccountByKind, isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverInterceptId = '*';
const driverId = '1fad966a-b2f4-427b-a0da-4b04be5f871f';
const vehicleId = 'b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c';

const fleetDriverIntercept = new FleetDriverIntercept(fleetId, driverInterceptId);
const fleetDriverImagesIntercept = new FleetDriverImagesIntercept(driverInterceptId);
const fleetDriverRideConditionsIntercept = new FleetDriverRideConditionsIntercept(fleetId, driverId);
const fleetVehicleImagesIntercept = new FleetVehicleImagesIntercept(fleetId, vehicleId);
const fleetDriverWalletIntercept = new FleetEmployeesWalletIntercept(fleetId, driverInterceptId);
const fleetDriversIntercept = new FleetDriverListIntercept(fleetId);
const driverRestrictionsIntercept = new FleetDriverRestrictionsIntercept(fleetId, driverId);
const driverPhotoControlIntercept = new DriverPhotoControlIntercept(fleetId);
const garageIntercept = new UklonGarageApplicationsIntercept('*');
const hasActiveTickets = new DriverPhotoControlHasActiveTicketsIntercept('*');

describe('Driver details', () => {
  const {
    avatar: { avatarHeight, avatarWidth },
  } = DRIVERS;

  let driverAvatarPhoto: string;
  let driverLicenseFrontPhoto: string;
  let driverLicenseReversePhoto: string;
  let driverResidencePhoto: string;

  const addImageIntercept = (imageName: string): string => {
    const url = `/aws-s3/${imageName}`;
    cy.intercept(url, {
      fixture: `images/${imageName}`,
    });

    return url;
  };

  beforeEach(() => {
    cy.loginWithSession('driverDetails');

    if (isMockingData()) {
      driverAvatarPhoto = addImageIntercept('driver-avatar.png');
      driverLicenseFrontPhoto = addImageIntercept('driver-license-front.jpg');
      driverLicenseReversePhoto = addImageIntercept('driver-license-reverse.jpg');
      driverResidencePhoto = addImageIntercept('driver-residence.png');

      fleetDriverIntercept.apply({
        name: 'ok',
        props: {
          vehicle: {
            vehicle_id: vehicleId,
            license_plate: 'AQA0001',
            fleet_id: '',
            make: 'Aston Martin',
            model: 'Vulcan',
            currentFleet: true,
          },
        },
      });
      fleetDriverImagesIntercept.apply({
        name: 'ok',
        props: {
          avatar: {
            url: driverAvatarPhoto,
          },
          licenseFront: {
            url: driverLicenseFrontPhoto,
          },
          licenseReverse: {
            url: driverLicenseReversePhoto,
          },
          residence: {
            url: driverResidencePhoto,
          },
        },
      });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRideConditionsIntercept.apply({ name: 'ok' });
      driverRestrictionsIntercept.apply({ name: 'ok' });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverStatisticIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });
      garageIntercept.apply({ name: 'ok' });
      hasActiveTickets.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    }

    cy.visit(`/workspace/drivers/details/${driverId}`);
  });

  describe('When open driver details', () => {
    it('[5501] the driver details page should be opened', () => {
      cy.url().should('includes', `workspace/drivers/details/${driverId}`);
    });

    if (isMockingData()) {
      it('[PF-187] back button should work', () => {
        fleetDriversIntercept.apply({ name: 'ok' });
        cy.visit('workspace/drivers');
        cy.getBySel('link').eq(0).click();
        cy.getBySel('shell-navigate-back-btn').should('exist').click();
        cy.url().should('includes', 'workspace/drivers');
      });

      it('[PF-188] driver full name should be correct', () => {
        cy.getBySel('driver-name').should('exist').should('contain', `Aqaafeyh404 Aqadpilu404`);
      });

      it('[PF-189] should have driver rating', () => {
        cy.getBySel('driver-rating').should('exist').should('contain', `5`);
      });

      it('[PF-190] should have driver karma', () => {
        cy.getBySel('driver-karma').should('exist').should('contain', `100%`);

        cy.getBySel('driver-karma-group').should('exist').should('contain', '1 група');

        cy.getBySel('driver-karma-calculation').should('exist').should('contain', `0`);

        cy.getBySel('driver-karma-reset').should('exist').should('contain', `0`);

        cy.getBySel('driver-karma-completed').should('exist').should('contain', `0`);

        cy.getBySel('driver-karma-rejected').should('exist').should('contain', `0`);

        cy.getBySel('driver-karma-canceled').should('exist').should('contain', `0`);
      });

      it('[PF-191] should have drive phone', () => {
        cy.getBySel('driver-phone').should('exist').should('have.text', `380506326599`);
      });

      it('[PF-192] should have driver email', () => {
        cy.getBySel('driver-email').should('exist').should('have.text', `404linct@uklon.aqa`);
      });

      it('[PF-193] should have added driver date', () => {
        cy.getBySel('driver-added-date').should('exist').should('have.text', ` 21.10.2022 `);
      });
    }
  });

  describe('When open driver photos', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-photo').click();
    });

    it('[5504] should have a driver license front copy', () => {
      let partOfSrc = `Driver/${driverId}/driver_license_front_copy`;
      if (isMockingData()) {
        partOfSrc = driverLicenseFrontPhoto;
      }

      cy.getBySel('driver-photo-driver_license_front_copy')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', partOfSrc);
    });

    it('[5504] should have a driver license reverse copy', () => {
      let partOfSrc = `Driver/${driverId}/driver_license_reverse_copy`;
      if (isMockingData()) {
        partOfSrc = driverLicenseReversePhoto;
      }

      cy.getBySel('driver-photo-driver_license_reverse_copy')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', partOfSrc);
    });

    it('[5504] should have an avatar', () => {
      cy.getBySel('user-avatar')
        .should('exist')
        .should(([img]) => {
          expect(img.clientWidth).to.equal(avatarWidth);
          expect(img.clientHeight).to.equal(avatarHeight);
        });
    });

    it('[5504] should have a residence', () => {
      let partOfSrc = `Driver/${driverId}/residence`;
      if (isMockingData()) {
        partOfSrc = driverResidencePhoto;
      }
      cy.getBySel('driver-photo-residence')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', partOfSrc);
    });
  });

  if (isMockingData()) {
    describe('Driver cash limit restriction', () => {
      const items = [
        {
          type: Restriction.CASH,
          restricted_by: RestrictionReason.CASH_LIMIT,
          fleet_id: '829492c9-29d5-41df-8e9b-14a407235ce1',
          current_fleet_id: '829492c9-29d5-41df-8e9b-14a407235ce1',
          fleet_name: 'any',
          actual_from: 1_741_012_937,
          actual_till: 1_741_557_599,
          created_at: 1_741_012_937,
          created_by: {
            display_name: 'System',
            roles: ['TrustedService'],
          },
        },
      ] as any;
      const getOpenDialogBtn = (): any => {
        cy.getBySel('driver-details-restrictions-panel').should('exist').should('be.visible');
        cy.getBySel('driver-details-restrictions-panel').find('[data-cy="info-panel-btn"]').should('exist').click();
        cy.getBySel('cash-limit-restriction')
          .should('exist')
          .should('contain', 'Обмеження на роботу з готівковими замовленнями: досягнуто ліміту в парку');
        cy.getBySel('cash-limit-restriction-btn').should('exist').should('contain', 'Зняти обмеження');
        return cy.getBySel('cash-limit-restriction-btn');
      };
      const resetLimitCases = [
        { id: '7991', value: true, text: 'почнеться з 0' },
        { id: '7992', value: false, text: 'продовжиться від поточної суми' },
      ];

      beforeEach(() => {
        driverRestrictionsIntercept.apply({ name: 'ok', props: { items } });
        cy.reload();
      });

      it('[7990] should have cash limit restriction', () => {
        getOpenDialogBtn();
      });

      it('should open restriction dialog', () => {
        getOpenDialogBtn().click();
        cy.getBySel('cash-limits-restriction-dialog').should('exist');
      });

      it('should close restriction dialog', () => {
        getOpenDialogBtn().click();
        cy.getBySel('cash-limits-restriction-dialog').should('exist');
        cy.getBySel('cash-limits-restriction-dialog-header-close-btn').should('exist').click();
        cy.getBySel('cash-limits-restriction-dialog').should('not.exist');

        cy.getBySel('cash-limit-restriction-btn').click();
        cy.getBySel('cash-limits-restriction-dialog').should('exist');
        cy.getBySel('cash-limits-restriction-dialog-footer-close-btn').should('exist').click();
        cy.getBySel('cash-limits-restriction-dialog').should('not.exist');

        cy.getBySel('cash-limit-restriction-btn').click();
        cy.getBySel('cash-limits-restriction-dialog').should('exist');
        cy.get('body').click(0, 0);
        cy.getBySel('cash-limits-restriction-dialog').should('not.exist');
      });

      resetLimitCases.forEach(({ id, value, text }) => {
        it(`[${id}] should delete restriction ${value ? 'with' : 'without'} cash count reset`, () => {
          const selector = value
            ? 'cash-limits-restriction-dialog-reset-radio'
            : 'cash-limits-restriction-dialog-no-reset-radio';
          driverRestrictionsIntercept.apply({ name: 'ok' });
          cy.intercept('DELETE', 'api/fleets/*/drivers/*/restrictions/cash-limit', { statusCode: 200 }).as(
            'deleteRestriction',
          );

          getOpenDialogBtn().click();
          cy.getBySel(selector).should('exist').should('contain', text).click();
          cy.getBySel(selector).should('have.class', 'mat-mdc-radio-checked');
          cy.getBySel('cash-limits-restriction-dialog-submit-btn').should('exist').should('contain', 'Зняти обмеження');
          cy.getBySel('cash-limits-restriction-dialog-submit-btn').click();
          cy.wait('@deleteRestriction').then(({ request }) => {
            expect(request.body.with_reset_limit).to.eq(value);
            cy.getBySel('driver-details-restrictions-panel').should('not.exist');
          });
        });
      });

      it('[7993] should display error on remove restriction fail', () => {
        cy.intercept('DELETE', 'api/fleets/*/drivers/*/restrictions/cash-limit', { statusCode: 400 }).as('error');
        getOpenDialogBtn().click();
        cy.getBySel('cash-limits-restriction-dialog-submit-btn').click();
        cy.wait('@error').then(() => {
          cy.get('.toast.error')
            .should('exist')
            .should('contain.text', 'Щось пішло не так, спробуйте будь-ласка пізніше');
        });
      });
    });
  }
});

describe('When delete driver', () => {
  beforeEach(() => {
    if (isMockingData()) {
      fleetDriverWalletIntercept.apply({ name: 'ok' });
      fleetDriverIntercept.apply({ name: 'ok' });
      driverPhotoControlIntercept.apply({ name: 'ok' });
      fleetDriverRestrictionsIntercept.apply({ name: 'ok' });
      fleetDriverImagesIntercept.apply({ name: 'ok' });
      fleetVehicleImagesIntercept.apply({ name: 'ok' });
      fleetDriverRideConditionsIntercept.apply({ name: 'ok' });
      fleetDriverDenyListIntercept.apply({ name: 'ok' });
      fleetDriverStatisticIntercept.apply({ name: 'ok' });

      cy.intercept('GET', '/api/fleets/region/*', {
        statusCode: 200,
        body: { id: 1, code: 'Kyiv', country_code: 'UA' },
      });
    } else {
      const globalPartnerModerator = getAccountByKind(AccountKind.GLOBAL_PARTNER_MODERATOR);
      cy.getToken(globalPartnerModerator.username, globalPartnerModerator.password).then((authToken) => {
        cy.request({
          method: 'PUT',
          url: 'https://partners.staging.uklon.net/api/v1/fleets/aa22e4e4-044e-4d5e-996e-6fdb2d48c919/drivers/04344465-24c9-46d7-b250-b4918212ab08',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
      });
    }
    cy.clearLocalStorage();
    const notificationFleetAccount = getAccountByKind(AccountKind.NOTIFICATION_OWNER);
    cy.loginWithSession('fleetWallet', notificationFleetAccount.username, notificationFleetAccount.password);
  });

  it('[5514] should be deleted', () => {
    cy.visit('/workspace/drivers/details/04344465-24c9-46d7-b250-b4918212ab08');
    cy.url().should('includes', '/04344465-24c9-46d7-b250-b4918212ab08');
    cy.get('.tw-grow > [data-cy="remove-driver-btn"]').click();
    cy.getBySel('comment-control').type('Test');
    cy.getBySel('remove-btn').click();

    if (isMockingData()) {
      fleetDriverIntercept.apply({ name: 'bad' });
    }
    cy.visit('/workspace/drivers/details/04344465-24c9-46d7-b250-b4918212ab08');
    cy.get('user-avatar').should('not.exist');
  });
});
