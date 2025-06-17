import { isMockingData } from '../../../support/utils';

if (isMockingData()) {
  describe('Vehicle addition - webview old', () => {
    beforeEach(() => {
      cy.clearLocalStorage();
      cy.loginWithSession('VehicleCreateWebviewOld');
      cy.intercept('GET', 'api/tickets/vehicle-photo-control/*', {
        body: { vehicle_id: '123', license_plate: 'KA1234AA' },
        statusCode: 200,
      });
      cy.intercept('GET', 'api/fleets/null/vehicles/123/license-plate', {
        body: { license_plate: 'KA1234AA' },
        statusCode: 200,
      });

      cy.intercept('POST', 'api/auth/refresh', { statusCode: 200 });
    });

    it('should show unsupported page if go to vehicle addition page', () => {
      cy.visit(
        '/vehicles/create?token=nsQVfLkH5sHqeyWQg7JimJnXcW7TU1v1GzjH60owAJ2q4%2FZRY5qy55JDiyorBmlBeK39bRs%2Bh0B81ZNSs%2FXz7oLHpj4VXFQs7i4ZLwO4OUc%3D&fleet_id=78c6453a-e0f7-47a0-bff7-38ceb043b317',
      );

      cy.getBySel('unsupported-page').should('be.visible');
    });

    it('should show unsupported page if go to vehicle ticket page', () => {
      cy.visit(
        '/vehicles/ticket?token=nsQVfLkH5sHqeyWQg7JimJnXcW7TU1v1GzjH60owAJ2q4%2FZRY5qy55JDiyorBmlBeK39bRs%2Bh0B81ZNSs%2FXz7oLHpj4VXFQs7i4ZLwO4OUc%3D&ticket_id=92a5b75e-1abf-4a95-a852-e6104304e653',
      );

      cy.getBySel('unsupported-page').should('be.visible');
    });

    it('should show unsupported page if go to photo control page', () => {
      cy.visit(
        '/vehicles/photo-control?token=nsQVfLkH5sHqeyWQg7JimJnXcW7TU1v1GzjH60owAJ24tR5Kb0nwOLWGVF4PYK8uaXXd8NYkWemv3JITXv3sF8rfMdlxYBsI2aQ4bn/vImI=&ticket_id=63af132c-7c8b-4bd7-9bcd-8a05e173eaf7&language=en',
      );

      cy.getBySel('unsupported-page').should('be.visible');
    });

    it('should show unsupported page if go to photo control page', () => {
      cy.visit('/vehicles/photo-control/success');
      cy.getBySel('unsupported-page').should('be.visible');
    });
  });
}
