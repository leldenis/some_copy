import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  CollectionCursorDto,
  GatewayNotificationImportance,
  GatewayNotificationType,
  NOTIFICATION_IMPORTANCE_MAP,
  NOTIFICATION_TYPE_MAP,
  NotificationEventDto,
  NotificationImportanceValue,
  NotificationItemDto,
  NotificationsUnreadCountDto,
  NotificationTypeValue,
} from '@data-access';
import { NOTIFICATIONS_COLLECTION_MOCK } from '@ui/core/mock/notifications.mock';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { ToastrModule } from 'ngx-toastr';
import { take } from 'rxjs';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpTesting: HttpTestingController;
  const fleetId = '2c854e0f-b08a-4447-9e2b-25b1a90f2f93';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot({})],
    });
    service = TestBed.inject(NotificationsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Check getFleetUnreadNotificationsCount method', () => {
    it('should return unread notifications count', (done) => {
      const mockResponse: NotificationsUnreadCountDto = { unread_count: 5 };

      service
        .getFleetUnreadNotificationsCount(fleetId)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({ unread_count: 5 });
          done();
        });

      const req = httpTesting.expectOne(`api/notifications/fleet/${fleetId}/unread-count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return 0 if no fleetId provided (Skip request for WebView)', (done) => {
      service
        .getFleetUnreadNotificationsCount('')
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual({ unread_count: 0 });
          done();
        });

      httpTesting.expectNone(`api/notifications/fleet//unread-count`);
    });
  });

  describe('Check getMultipleFleetsUnreadNotificationsCount method', () => {
    it('should return unread notifications count for multiple fleets', (done) => {
      const fleetIds = [fleetId, 'ff3a2bf9-8465-4a3e-bed8-2bb5089a667e'];
      const mockResponse = { [fleetId]: 3, 'ff3a2bf9-8465-4a3e-bed8-2bb5089a667e': 7 };

      service
        .getMultipleFleetsUnreadNotificationsCount(fleetIds)
        .pipe(take(1))
        .subscribe((response) => {
          expect(Object.keys(response).length).toBe(2);
          expect(response[fleetId]).toBe(3);
          done();
        });

      const req = httpTesting.expectOne(`api/notifications/fleet/unread-count`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ items: fleetIds });
      req.flush(mockResponse);
    });
  });

  describe('Check getFleetNotificationsHistory method', () => {
    it('should return notifications history', (done) => {
      const cursor = '0';
      const limit = 30;
      const mockResponse: CollectionCursorDto<NotificationItemDto> = NOTIFICATIONS_COLLECTION_MOCK;

      service
        .getFleetNotificationsHistory(fleetId, cursor, limit)
        .pipe(take(1))
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
          const firstItem = response.items[0];
          expect(typeof firstItem.id).toBe('string');
          expect(typeof firstItem.sent_at).toBe('number');
          expect(typeof firstItem.is_read).toBe('boolean');
          expect(typeof firstItem.message).toBe('string');
          expect(typeof firstItem.message).toBe('string');

          const notificationTypeValues = Object.values(NotificationTypeValue);
          expect(notificationTypeValues).toContain(firstItem.type);

          const notificationImportanceTypeValues = Object.values(NotificationImportanceValue);
          expect(notificationImportanceTypeValues).toContain(firstItem.importance);

          done();
        });

      const req = httpTesting.expectOne(`api/notifications/fleet/${fleetId}?cursor=${cursor}&limit=${limit}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should includes all notification types', () => {
      const notificationTypes = [
        NotificationTypeValue.UNSPECIFIED,
        NotificationTypeValue.DRIVER_BLOCKED,
        NotificationTypeValue.DRIVER_UNBLOCKED,
        NotificationTypeValue.VEHICLE_BLOCKED,
        NotificationTypeValue.VEHICLE_UNBLOCKED,
        NotificationTypeValue.FLEET_CONTACT_BLOCKED,
        NotificationTypeValue.FLEET_CONTACT_UNBLOCKED,
        NotificationTypeValue.VEHICLE_ADDED_TO_FLEET,
        NotificationTypeValue.VEHICLE_REMOVED_FROM_FLEET,
        NotificationTypeValue.DRIVER_ADDED_TO_FLEET,
        NotificationTypeValue.DRIVER_REMOVED_FROM_FLEET,
        NotificationTypeValue.FLEET_CONTACT_ADDED,
        NotificationTypeValue.FLEET_CONTACT_REMOVED,
        NotificationTypeValue.DRIVER_BAD_FEEDBACK_RECEIVED,
        NotificationTypeValue.DRIVER_BAD_FEEDBACK_CONFIRMED,
        NotificationTypeValue.DRIVER_BAD_FEEDBACK_NOT_CONFIRMED,
        NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_APPROVED,
        NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_REJECTED,
        NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION,
        NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_SENT,
        NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_APPROVED,
        NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_REJECTED,
        NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_CLARIFICATION,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_APPROVED,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_REJECTED,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_CLARIFICATION,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_DEADLINE_CAME,
        NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED,
        NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED,
        NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED,
        NotificationTypeValue.ACCEPTANCE_REQUIRED,
        NotificationTypeValue.IMPORTANT_INFORMATION,
        NotificationTypeValue.FLEET_CABINET_UPDATE,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATE,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CREATED_BLOCK_IMMEDIATELY,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_APPROVED,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_REJECTED,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_CLARIFICATION,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_DEADLINE_CAME,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CREATED_BULK,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_REJECTED,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_CLARIFICATION,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_DEADLINE_REMINDER_BULK,
        NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_MANUAL_REMINDER,
        NotificationTypeValue.DRIVER_PHOTO_CONTROL_TICKET_MANUAL_REMINDER,
        NotificationTypeValue.VEHICLE_PHOTO_CONTROL_TICKET_MANUAL_REMINDER,
        NotificationTypeValue.VEHICLE_BRANDING_PERIOD_TICKET_MANUAL_REMINDER,
        NotificationTypeValue.FLEET_DRIVER_CASH_LIMIT_EXCEEDED,
      ];

      Object.values(NotificationTypeValue).forEach((item) => {
        expect(Object.values(notificationTypes)).toContain(item);
      });
    });

    it('should includes all importance types', () => {
      const notificationImportanceTypes = [
        NotificationImportanceValue.UNSPECIFIED,
        NotificationImportanceValue.NORMAL,
        NotificationImportanceValue.HIGH,
        NotificationImportanceValue.CRITICAL,
      ];

      Object.values(NotificationImportanceValue).forEach((item) => {
        expect(Object.values(notificationImportanceTypes)).toContain(item);
      });
    });
  });

  describe('Check updateCount method', () => {
    it('should update the count', (done) => {
      service.updateCount(5);
      service.updateCount(2);
      service.updateCount(3);
      service.unreadCount$.subscribe((count) => {
        expect(count).toEqual(10);
        done();
      });
    });
  });

  describe('Check handleNewEvent method', () => {
    it('should handle a new event', (done) => {
      const event: NotificationEventDto = {
        eventId: '00c812ec-62c7-44a7-95d3-3edfbe20d226',
        // @ts-expect-error because not all interfaces are implemented
        occurredAt: '1716539633',
        // @ts-expect-error because not all interfaces are implemented
        notification: {
          id: '00c812ec-62c7-44a7-95d3-3edfbe20d226',
          type: GatewayNotificationType.UNSPECIFIED,
          importance: GatewayNotificationImportance.HIGH,
          message: 'Hello world!',
          fleetId,
        },
      };

      service.newNotification$.subscribe((notification) => {
        expect(notification.id).toBe(event.notification.id);
        expect(notification.sent_at).toBe(Number(event.occurredAt));
        expect(notification.is_read).toBe(false);
        expect(notification.type).toBe(NOTIFICATION_TYPE_MAP[event.notification.type]);
        expect(notification.importance).toBe(NOTIFICATION_IMPORTANCE_MAP[event.notification.importance]);
        expect(notification.message).toBe(event.notification.message);
        expect(notification.fleet_id).toBe(event.notification.fleetId);
        done();
      });

      service.handleNewEvent(event);
    });
  });

  describe('Check openNotificationsSidenav method', () => {
    it('should open notifications sidenav', (done) => {
      service.openSidenav$.subscribe(() => {
        done();
      });

      service.openNotificationsSidenav();
    });

    it('should close notifications sidenav', (done) => {
      service.closeSidenav$.subscribe(() => {
        done();
      });

      service.closeNotificationsSidenav();
    });
  });
});
