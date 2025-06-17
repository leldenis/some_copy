import { DRIVERS } from '../../../support/config';

describe('Driver details', () => {
  const {
    avatar: { avatarHeight, avatarWidth },
  } = DRIVERS;

  beforeEach(() => {
    cy.loginWithSession('driverDetails');
    cy.visit(`/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
  });

  describe('When open driver details', () => {
    it.skip('[PF-1124] the driver details page should be opened', () => {
      cy.url().should('includes', `workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
    });

    it.skip('[PF-1125] back button should work', () => {
      cy.visit('workspace/drivers');
      cy.visit(`/workspace/drivers/details/1fad966a-b2f4-427b-a0da-4b04be5f871f`);
      cy.getBySel('shell-navigate-back-btn').should('exist').click();
      cy.url().should('includes', 'workspace/drivers');
    });

    it.skip('[PF-1126] driver full name should be correct', () => {
      cy.getBySel('driver-name').should('exist').should('contain', `Aqadpilu404 Aqaafeyh404`);
    });

    it.skip('[PF-1127] should have driver rating', () => {
      cy.getBySel('driver-rating').should('exist').should('contain', `5`);
    });

    it.skip('[PF-1128] should have driver karma', () => {
      cy.getBySel('driver-karma').should('exist').should('contain', `100%`);

      cy.getBySel('driver-karma-group').should('exist').should('contain', '1 група');

      cy.getBySel('driver-karma-calculation').should('exist').should('contain', `0`);

      cy.getBySel('driver-karma-reset').should('exist').should('contain', `0`);

      cy.getBySel('driver-karma-completed').should('exist').should('contain', `0`);

      cy.getBySel('driver-karma-rejected').should('exist').should('contain', `0`);

      cy.getBySel('driver-karma-canceled').should('exist').should('contain', `0`);
    });

    it.skip('[PF-1129] should have drive phone', () => {
      cy.getBySel('driver-phone').should('exist').should('have.text', `380506326599`);
    });

    it.skip('[PF-1130] should have driver email', () => {
      cy.getBySel('driver-email').should('exist').should('have.text', `404linct@uklon.aqa`);
    });

    it.skip('[PF-1131] should have added driver date', () => {
      cy.getBySel('driver-added-date').should('exist').should('have.text', ` 21.10.2022 `);
    });
  });

  describe('When open driver photos', () => {
    beforeEach(() => {
      cy.getBySel('driver-details-tabs-photo').click();
    });

    it.skip('[PF-1132] should have an avatar', () => {
      cy.getBySel('user-avatar')
        .should('exist')
        .should(([img]) => {
          expect(img.clientWidth).to.equal(avatarWidth);
          expect(img.clientHeight).to.equal(avatarHeight);
        });
    });

    it.skip('[PF-1133] should have a driver license front copy', () => {
      cy.getBySel('driver-photo-driver_license_front_copy')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', 'Driver/1fad966a-b2f4-427b-a0da-4b04be5f871f/driver_license_front_copy');
    });

    it.skip('[PF-1134] should have a driver license reverse copy', () => {
      cy.getBySel('driver-photo-driver_license_reverse_copy')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', 'Driver/1fad966a-b2f4-427b-a0da-4b04be5f871f/driver_license_reverse_copy');
    });

    it.skip('[PF-1135] should have a residence', () => {
      cy.getBySel('driver-photo-residence')
        .find('[data-cy="photo"]')
        .should('exist')
        .should('have.attr', 'src')
        .should('contain', 'Driver/1fad966a-b2f4-427b-a0da-4b04be5f871f/residence');
    });
  });
});
