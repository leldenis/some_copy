import { UklonGarageApplicationsIntercept } from '../../../../support/interceptor';
import { DriverPhotoControlHasActiveTicketsIntercept } from '../../../../support/interceptor/drivers/photo-control/has-active-tickets';
import { DriverPhotoControlListIntercept } from '../../../../support/interceptor/drivers/photo-control/list';
import { isMockingData } from '../../../../support/utils';

const fleetId = '*';
const driverPhotoControlHasActiveTickets = new DriverPhotoControlHasActiveTicketsIntercept(fleetId);
const driverPhotoControl = new DriverPhotoControlListIntercept(fleetId, '*');
const garageIntercept = new UklonGarageApplicationsIntercept('*');

if (isMockingData()) {
  describe('Driver photo control list', () => {
    beforeEach(() => {
      driverPhotoControlHasActiveTickets.apply({ name: 'ok', props: { hasActiveTickets: true } });
      driverPhotoControl.apply({ name: 'ok' });
      garageIntercept.apply({ name: 'ok' });

      cy.clearLocalStorage();
      cy.loginWithSession('driverPhotoControl');
      cy.visit('/workspace/drivers#photo-control');
      cy.useDateRangeFilter('last-week');
    });

    describe('[7179] should exist data in table', () => {
      it('should display tickets indicator', () => {
        cy.getBySel('driver-photo-control-tab-indicator').should('be.visible');
      });

      it('driver photo control table exist', () => {
        cy.getBySel('driver-photo-control-list').should('exist');
      });

      it('should headers exist', () => {
        cy.getBySel('driver-header-name').should('be.visible');
        cy.getBySel('driver-header-phone').should('be.visible');
        cy.getBySel('driver-header-reason').should('be.visible');
        cy.getBySel('driver-header-deadline').should('be.visible');
        cy.getBySel('driver-header-photos').should('be.visible');
        cy.getBySel('driver-header-status').should('be.visible');
      });

      it('should row exist', () => {
        cy.getBySel('driver-row-name').should('be.visible');
        cy.getBySel('driver-row-phone').should('be.visible');
        cy.getBySel('driver-row-reason').should('be.visible');
        cy.getBySel('driver-row-deadline').should('be.visible');
        cy.getBySel('driver-row-photos').should('be.visible');
        cy.getBySel('driver-row-status').should('be.visible');
      });

      it('should display reasons of photo control', () => {
        cy.getBySel('driver-row-reason')
          .should('be.visible')
          .contains('Після перших N замовлень')
          .contains('Відсутні фото водія/документів')
          .contains('Протермінований документ')
          .contains('Оновлення даних профілю')
          .contains('Запит додаткових документів')
          .contains('Інше');
      });

      it('should display required photos', () => {
        cy.getBySel('driver-row-photos')
          .should('be.visible')
          .contains('Фото профілю')
          .contains('Лицьова сторона')
          .contains('Зворотній бік')
          .contains('Вид на проживання')
          .contains('Лицьова сторона')
          .contains('Зворотна сторона')
          .contains('Довідка про несудимість (повна)')
          .contains('Посвідчення УБД');
      });

      it('should display ticket status, ', () => {
        cy.getBySel('panel-item-0').getBySel('driver-row-status').should('be.visible').contains('Очікує на фк');
        cy.getBySel('panel-item-1').getBySel('driver-row-status').should('be.visible').contains('Надіслано');
        cy.getBySel('panel-item-2').getBySel('driver-row-status').should('be.visible').contains('На перевірці');
        cy.getBySel('panel-item-3').getBySel('driver-row-status').should('be.visible').contains('Уточніть дані');
        cy.getBySel('panel-item-4').getBySel('driver-row-status').should('be.visible').contains('Підтверджено');
        cy.getBySel('panel-item-5').getBySel('driver-row-status').should('be.visible').contains('Відхилено');
      });

      it('should display link to go photo control for ticket status Draft and Clarification', () => {
        cy.getBySel('panel-item-0')
          .getBySel('driver-row-status')
          .should('be.visible')
          .contains('Очікує на фк')
          .getBySel('driver-photo-control-link')
          .should('be.visible');

        cy.getBySel('panel-item-3')
          .getBySel('driver-row-status')
          .should('be.visible')
          .contains('Уточніть дані')
          .getBySel('driver-photo-control-link')
          .should('be.visible');
      });
    });

    describe('[7180] should have filters', () => {
      it('should have period filter', () => {
        cy.getBySel('driver-photo-control-period').should('exist').click();
        cy.getBySelLike('date-range-option').should('have.length', 9);
        cy.getBySelLike('date-range-option').eq(2).click();
      });

      it('should have status filter', () => {
        cy.getBySel('driver-photo-control-status').should('exist').click();
        cy.getBySelLike('driver-photo-control-status-options').should('have.length', 7);
        cy.getBySelLike('driver-photo-control-status-options').eq(2).click();
        cy.getBySel('filter-reset-btn').should('exist').click();
      });

      it('should display Clear btn if any filter is applied', () => {
        cy.getBySel('filter-reset-btn').should('not.exist');
        cy.getBySel('driver-photo-control-phone').should('exist').type('380502314400');
        cy.getBySel('filter-reset-btn').should('exist').click();
        cy.getBySel('filter-reset-btn').should('not.exist');
      });
    });

    it('[7181] should display block icon for driver', () => {
      cy.getBySel('driver-photo-control-list').should('exist');
      cy.getBySel('driver-blocked-btn').should('be.visible');
    });

    it('[7182] should display empty state', () => {
      driverPhotoControl.apply({ name: 'ok', props: { count: 0 } });
      cy.getBySel('no-data').should('be.visible');
    });

    it('[7653] should display same status for Review and BlockedByManager statuses', () => {
      driverPhotoControl.apply({ name: 'ok', props: { count: 15 } });
      cy.reload();

      cy.getBySel('driver-row-status').eq(2).should('contain', 'На перевірці');
      cy.getBySel('driver-row-status').eq(11).should('contain', 'На перевірці');
    });
  });
}
