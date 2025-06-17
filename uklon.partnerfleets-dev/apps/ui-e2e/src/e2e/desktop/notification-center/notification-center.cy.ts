import { NotificationImportanceValue, NotificationTypeValue } from '@data-access';

import {
  NotificationDetailsIntercept,
  NotificationsHistoryIntercept,
  TopUnreadNotificationsIntercept,
  UnreadCountIntercept,
  MeIntercept,
} from '../../../support/interceptor';
import { FleetsUnreadCountIntercept } from '../../../support/interceptor/unread-count/fleets';
import { isMockingData } from '../../../support/utils';

const BULK_NOTIFICATIONS = [
  {
    name: 'AcceptanceRequired',
    bgColor: 'rgb(255, 247, 220)',
    borderColor: 'rgb(249, 155, 88)',
    avatarColor: 'rgb(249, 155, 88)',
    btnColor: 'rgb(249, 155, 88)',
    icon: 'warning',
    isPinned: true,
  },
  {
    name: 'ImportantInformation',
    bgColor: 'rgb(237, 252, 255)',
    borderColor: 'rgb(27, 176, 206)',
    avatarColor: 'rgb(27, 176, 206)',
    btnColor: 'rgb(27, 176, 206)',
    icon: 'error',
    isPinned: false,
  },
  {
    name: 'FleetOnboarding',
    bgColor: 'rgb(245, 252, 250)',
    borderColor: 'rgb(51, 204, 161)',
    avatarColor: 'rgb(51, 204, 161)',
    btnColor: 'rgb(31, 153, 119)',
    icon: 'info',
    isPinned: false,
  },
];
const ACCEPTED_NOTIFICATION = {
  id: 'test',
  importance: NotificationImportanceValue.NORMAL,
  type: NotificationTypeValue.ACCEPTANCE_REQUIRED,
  message: `Hello world 0}`,
  sent_at: 1_730_271_950,
  is_read: true,
  is_bulk: true,
  is_acceptance_required: true,
  accepted_at: 1_730_271_950,
};

if (isMockingData()) {
  describe('Notification center', () => {
    const topUnreadIntercept = new TopUnreadNotificationsIntercept();
    const notificationsHistoryIntercept = new NotificationsHistoryIntercept();
    const notificationDetailsIntercept = new NotificationDetailsIntercept();
    const unreadCountIntercept = new UnreadCountIntercept('*');

    beforeEach(() => {
      topUnreadIntercept.apply({ name: 'ok' }).as('topUnread');
      notificationsHistoryIntercept.apply({ name: 'ok' });
      unreadCountIntercept.apply({ name: 'ok', props: { count: 10 } });

      cy.intercept('POST', 'api/notifications/fleet/*/unread/*', { statusCode: 201 }).as('unread');
      cy.intercept('POST', 'api/notifications/fleet/*/read/*', { statusCode: 201 }).as('read');
      cy.intercept('POST', 'api/notifications/fleet/*/notifications/*/accept', { statusCode: 201 }).as('accept');

      cy.clearLocalStorage();
      cy.loginWithSession('notificationCenter');
      cy.visit('workspace/general');
    });

    describe('Notifications toasts', () => {
      it('[5761] Should display 3 toasts', () => {
        cy.getBySel('notification-toast').should('have.length', 3);
      });

      it('[5762] Should mark notification as read and close toast', () => {
        cy.getBySel('toast-message').eq(0).should('exist').should('contain', 'Hello world 0');
        cy.getBySel('toast-close-icon').eq(0).should('exist').click();

        cy.wait('@read').its('response.statusCode').should('eq', 201);

        cy.getBySel('notification-toast').should('have.length', 2);
        cy.getBySel('toast-message').eq(0).should('exist').should('contain', 'Hello world 1');
      });

      it('[5763] Should close all notifications', () => {
        cy.getBySel('toast-message').each((_, index) => {
          cy.getBySel('toast-close-icon').eq(0).should('exist').click();
          cy.wait('@read').its('response.statusCode').should('eq', 201);
          cy.getBySel('notification-toast').should('have.length', 2 - index);
        });

        cy.getBySel('notification-toast').should('have.length', 0);
      });

      it('[5764] Should open notification details', () => {
        notificationDetailsIntercept.apply({ name: 'ok' });
        cy.getBySel('notification-toast').eq(0).click();
        cy.getBySel('notification-details-dialog').should('exist');
        cy.getBySel('notification-details-dialog-message').should('exist').should('contain', 'Hello world');
      });
    });

    describe('Notifications sidebar', () => {
      beforeEach(() => {
        cy.getBySel('open-notification-center-btn').should('exist').click();
      });

      BULK_NOTIFICATIONS.forEach(({ name, bgColor, borderColor, avatarColor, btnColor, icon, isPinned }, index) => {
        it(`[5765]${index ? '' : ', [5766]'} should display ${name} notification`, () => {
          cy.getBySel('notification').eq(index).as('notification');
          cy.get('@notification').should('have.css', 'background-color').and('eq', bgColor);

          cy.get('@notification')
            .find('[data-cy="notification-border"]')
            .should('have.css', 'background-color')
            .and('eq', borderColor);

          cy.get('@notification')
            .find('[data-cy="notification-avatar"]')
            .should('have.css', 'background-color')
            .and('eq', avatarColor);

          cy.get('@notification')
            .find('[data-cy="notification-avatar"]')
            .find('.mat-icon')
            .should('exist')
            .should('contain', icon);

          cy.get('@notification')
            .find('[data-cy="notification-acknowledge-btn"]')
            .should('exist')
            .should('contain', 'Ознайомитись')
            .should('have.css', 'color')
            .and('eq', btnColor);

          cy.get('@notification')
            .find('[data-cy="notification-message"]')
            .should('exist')
            .should('contain', `Hello world ${index}`);

          cy.get('@notification')
            .find('[data-cy="notification-pin-icon"]')
            .should(isPinned ? 'exist' : 'not.exist');

          cy.get('@notification')
            .find('[data-cy="notification-read-marker"]')
            .should(isPinned ? 'not.exist' : 'exist');
        });
      });

      it('[5767] should unpin notification after accepting it', () => {
        notificationDetailsIntercept.apply({ name: 'ok' });
        notificationsHistoryIntercept.apply({ name: 'ok', props: { items: [ACCEPTED_NOTIFICATION] } });

        cy.getBySel('pinned-notifications').find('[data-cy="notification"]').should('have.length', 1);

        cy.getBySel('notification').eq(0).as('notification');
        cy.get('@notification').find('[data-cy="notification-acknowledge-btn"]').click();
        cy.getBySel('notification-details-dialog-checkbox').click();
        cy.getBySel('notification-details-dialog-accept-btn').click();

        cy.wait('@accept').its('response.statusCode').should('eq', 201);
        cy.wait('@read').its('response.statusCode').should('eq', 201);

        cy.getBySel('pinned-notifications').should('not.exist');
        cy.get('@notification').find('[data-cy="notification-pin-icon"]').should('not.exist');
        cy.get('@notification').find('[data-cy="notification-read-marker"]').should('exist');
      });

      it('[5768] should mark accepted AcceptanceRequired notification as unread', () => {
        notificationDetailsIntercept.apply({ name: 'ok' });
        notificationsHistoryIntercept.apply({ name: 'ok', props: { items: [ACCEPTED_NOTIFICATION] } });

        cy.getBySel('notification').eq(0).as('notification');
        cy.get('@notification').find('[data-cy="notification-acknowledge-btn"]').click();
        cy.getBySel('notification-details-dialog-checkbox').click();
        cy.getBySel('notification-details-dialog-accept-btn').click();

        cy.get('@notification').find('[data-cy="notification-read-marker-dot"]').should('not.exist');
        cy.get('@notification').find('[data-cy="notification-read-marker"]').click();
        cy.wait('@unread').its('response.statusCode').should('eq', 201);
        cy.get('@notification').find('[data-cy="notification-read-marker-dot"]').should('exist');
      });
    });

    describe('Notification details dialog', () => {
      const notificationDetails = {
        id: 'test',
        type: NotificationTypeValue.IMPORTANT_INFORMATION,
        image_base_64: '',
        message: 'Hello world',
        details: 'Important information',
        accepted_at: 0,
      };

      it('[6994] should show notification details', () => {
        notificationDetailsIntercept.apply({
          name: 'ok',
          props: { notificationDetails: { ...notificationDetails, image_base_64: 'https://picsum.photos/300/200' } },
        });
        cy.getBySel('notification-toast').eq(0).click();

        cy.getBySel('notification-details-dialog').should('exist');
        cy.getBySel('notification-details-dialog-image')
          .should('exist')
          .should('have.attr', 'src')
          .should('contain', 'https://picsum.photos/300/200');
        cy.getBySel('notification-details-dialog-message')
          .should('exist')
          .should('contain', notificationDetails.details);
        cy.getBySel('notification-details-dialog-checkbox').should('not.exist');
        cy.getBySel('notification-details-dialog-skip-btn').should('not.exist');
        cy.getBySel('notification-details-dialog-accept-btn').should('exist').should('contain', 'Зрозуміло').click();
        cy.getBySel('notification-details-dialog').should('not.exist');
      });

      it('[6995] Should not show image if no image provided', () => {
        notificationDetailsIntercept.apply({
          name: 'ok',
          props: { notificationDetails },
        });
        cy.getBySel('notification-toast').eq(0).click();
        cy.getBySel('notification-details-dialog-image').should('not.exist');
      });

      it('[6996] should display AcceptanceRequired notification details', () => {
        notificationDetailsIntercept.apply({
          name: 'ok',
          props: { notificationDetails: { ...notificationDetails, type: NotificationTypeValue.ACCEPTANCE_REQUIRED } },
        });
        cy.getBySel('notification-toast').eq(0).click();

        cy.getBySel('notification-details-dialog-checkbox').should('exist');
        cy.getBySel('notification-details-dialog-accept-btn').should('be.disabled');
        cy.getBySel('notification-details-dialog-skip-btn').should('exist').should('not.be.disabled');

        cy.getBySel('notification-details-dialog-skip-btn').click();
        cy.getBySel('notification-details-dialog').should('not.exist');
        cy.getBySel('toast-message').eq(0).should('contain', 'Hello world 0');

        cy.getBySel('notification-toast').eq(0).click();
        cy.getBySel('notification-details-dialog-checkbox').click();
        cy.getBySel('notification-details-dialog-accept-btn').should('not.be.disabled').click();
        cy.wait('@accept').its('response.statusCode').should('eq', 201);
        cy.wait('@read').its('response.statusCode').should('eq', 201);
        cy.getBySel('toast-message').eq(0).should('contain', 'Hello world 0');
      });

      it('[6997] should display AcceptanceRequired notification details after acceptance', () => {
        notificationDetailsIntercept.apply({
          name: 'ok',
          props: {
            notificationDetails: {
              ...notificationDetails,
              type: NotificationTypeValue.ACCEPTANCE_REQUIRED,
              accepted_at: 1,
            },
          },
        });
        cy.getBySel('notification-toast').eq(0).click();

        cy.getBySel('notification-details-dialog-checkbox').should('not.exist');
        cy.getBySel('notification-details-dialog-accepted-message')
          .should('exist')
          .should('contain', 'Ви підтвердили ознайомлення');
        cy.getBySel('notification-details-dialog-accept-btn')
          .should('not.be.disabled')
          .should('contain', 'Зрозуміло')
          .click();
        cy.getBySel('notification-details-dialog').should('not.exist');
      });
    });
  });

  describe('Fleets notification', () => {
    const fleetIds = ['1d54905a-bc2d-4b63-a707-b80db66ded74', '6a501899-1807-43fb-8942-b5d99c4a19b4'];
    const meData = new MeIntercept();
    const unreadCount = new FleetsUnreadCountIntercept();

    describe('Fleet List With notification', () => {
      beforeEach(() => {
        meData.apply({
          name: 'ok',
          props: { fleetsId: fleetIds },
        });
        unreadCount.apply({
          name: 'ok',
          props: { fleetsNotifications: { [fleetIds[0]]: 1, [fleetIds[1]]: 2 } },
        });
        cy.loginWithSession('fleetList');
        cy.visit('/');
        cy.getBySel('fleets-list-button').should('be.visible').click();
      });

      it('[7761] Should display unread count', () => {
        cy.getBySel('fleet-unread-1d54905a-bc2d-4b63-a707-b80db66ded74').should('contain', 'Повідомлень: 1');
      });
    });
  });
}
