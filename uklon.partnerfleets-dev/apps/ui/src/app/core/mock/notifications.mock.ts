import {
  CollectionCursorDto,
  NotificationImportanceValue,
  NotificationItemDto,
  NotificationTypeValue,
} from '@data-access';

const NOTIFICATION_ITEMS_MOCK: NotificationItemDto[] = [
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e21',
    importance: NotificationImportanceValue.HIGH,
    type: NotificationTypeValue.DRIVER_BAD_FEEDBACK_RECEIVED,
    message:
      "<b>Водій <a href='/workspace/drivers/details/32174d5e-359e-4dbd-b5f9-4d42a38a4cee'>Антон Караванський\n</a> отримав <a href='/workspace/feedbacks?driverId=32174d5e-359e-4dbd-b5f9-4d42a38a4cee&sentAt=1710759688'>оцінку 4</a></b>",
    sent_at: 1_713_531_726,
    is_read: true,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e20',
    importance: NotificationImportanceValue.NORMAL,
    type: NotificationTypeValue.VEHICLE_ADDED_TO_FLEET,
    message:
      "<b>Водій <a href='/workspace/drivers/details/32174d5e-359e-4dbd-b5f9-4d42a38a4cee'>Антон Караванський\n</a> отримав <a href='/workspace/feedbacks?driverId=32174d5e-359e-4dbd-b5f9-4d42a38a4cee&sentAt=1713450162'>оцінку 2</a></b>",
    sent_at: 1_713_530_639,
    is_read: false,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e19',
    importance: NotificationImportanceValue.NORMAL,
    type: NotificationTypeValue.VEHICLE_ADDED_TO_FLEET,
    message:
      "<b>Водій <a href='/workspace/drivers/details/32174d5e-359e-4dbd-b5f9-4d42a38a4cee'>Антон Караванський\n</a> отримав <a href='/workspace/feedbacks?driverId=32174d5e-359e-4dbd-b5f9-4d42a38a4cee'>оцінку 2</a></b>",
    sent_at: 1_713_514_121,
    is_read: false,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989ef6',
    importance: NotificationImportanceValue.NORMAL,
    type: NotificationTypeValue.VEHICLE_TO_FLEET_ADDITION_TICKET_CLARIFICATION,
    message: 'hello world',
    sent_at: 1_712_678_519,
    is_read: true,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989ef5',
    importance: NotificationImportanceValue.NORMAL,
    type: NotificationTypeValue.FLEET_DRIVER_REGISTRATION_TICKET_REJECTED,
    message: 'hello world',
    sent_at: 1_712_678_490,
    is_read: true,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989ed7',
    importance: NotificationImportanceValue.HIGH,
    type: NotificationTypeValue.DRIVER_BAD_FEEDBACK_RECEIVED,
    message: 'New notification',
    sent_at: 1_712_675_887,
    is_read: true,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989ed3',
    importance: NotificationImportanceValue.UNSPECIFIED,
    type: NotificationTypeValue.UNSPECIFIED,
    message: 'Test message',
    sent_at: 1_712_574_320,
    is_read: true,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e21',
    importance: NotificationImportanceValue.HIGH,
    is_read: true,
    message: '<b>Важливо!</b><p>Зміна типу корегування була скасована</p>',
    sent_at: 1_713_531_726,
    type: NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CANCELED,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e21',
    importance: NotificationImportanceValue.HIGH,
    is_read: true,
    message:
      "<b>Важливо!</b><p>Тип розподілу платежу парку було змінено. Деталі в розділі <a href='/workspace/fleet-profile'><b>Історія змін.</b></a></p>",
    sent_at: 1_713_531_726,
    type: NotificationTypeValue.B2B_SPLIT_ADJUSTMENT_CHANGED,
  },
  {
    id: 'b3cf6f92-55a9-45c4-a941-0ec088989e21',
    importance: NotificationImportanceValue.HIGH,
    is_read: true,
    message: '<b>Важливо!</b><p>Тип розподілу платежу парку було змінено на: <b>По залишку на балансі.</b></p>',
    sent_at: 1_713_531_726,
    type: NotificationTypeValue.B2B_SPLIT_DISTRIBUTION_CHANGED,
  },
];

export const NOTIFICATIONS_COLLECTION_MOCK: CollectionCursorDto<NotificationItemDto> = {
  items: NOTIFICATION_ITEMS_MOCK,
  next_cursor: '30',
  previous_cursor: '1',
};
