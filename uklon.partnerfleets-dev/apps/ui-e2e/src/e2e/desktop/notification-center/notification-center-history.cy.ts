import { NotificationImportanceValue, NotificationTypeValue } from '@data-access';

import { NotificationsHistoryIntercept } from '../../../support/interceptor';
import { isMockingData } from '../../../support/utils';

const B2B_NOTIFICATION = {
  id: 'be308fe5-cfe1-4406-a7f7-5ab85877c265',
  importance: NotificationImportanceValue.HIGH,
  type: NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED,
  message: `<b>Важливо!</b><p>Тип розподілу платежу парку було змінено. Деталі в розділі <a href='/workspace/fleet-profile'><b>Історія змін.</b></a></p>`,
  sent_at: 1_730_117_791,
  is_read: false,
  is_bulk: false,
  is_acceptance_required: false,
  accepted_at: 0,
};

if (isMockingData()) {
  describe('Notification center history messages', () => {
    const notificationsHistoryIntercept = new NotificationsHistoryIntercept();

    beforeEach(() => {
      notificationsHistoryIntercept.apply({ name: 'ok', props: { items: [B2B_NOTIFICATION] } });

      cy.intercept('GET', 'api/fleets/*/finance/individual-entrepreneurs?includeWithdrawalType=true', {
        statusCode: 200,
      });

      cy.clearLocalStorage();
      cy.loginWithSession('notificationCenter');
      cy.visit('workspace/general');
    });

    describe('Notifications sidebar', () => {
      beforeEach(() => {
        cy.getBySel('open-notification-center-btn').should('exist').click();
      });

      it(`[8297] should display B2B_SPLIT_ADJUSTMENT_CHANGED notification`, () => {
        cy.getBySel('notification').eq(0).as('notification');
        cy.get('@notification').within(() => {
          cy.contains('b', 'Важливо!');
          cy.contains('p', 'Тип розподілу платежу парку було змінено. Деталі в розділі');
          cy.get('a').should('have.attr', 'href', '/workspace/fleet-profile');
          cy.get('a').should('contain.text', 'Історія змін.');
          cy.getBySel('notification-author').should('exist').should('contain.text', 'Менеджер Уклон •');
          cy.getBySel('notification-sent-at').should('exist').should('contain.text', '12:16');
        });
      });
    });
  });
}
