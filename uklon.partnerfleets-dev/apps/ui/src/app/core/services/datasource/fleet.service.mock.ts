import { TicketType } from '@constant';
import { CollectionCursorDto, FleetHistoryChangeItemDto, FleetHistoryType, HistoryInitiatorType } from '@data-access';

export const FLEET_HISTORY_MOCK: CollectionCursorDto<FleetHistoryChangeItemDto> = {
  next_cursor: '0',
  previous_cursor: '0',
  items: [
    {
      id: '7b8e3d03-adc4-46b5-9359-31ceba5a0108',
      change_type: FleetHistoryType.VEHICLE_REGISTERED,
      occurred_at: 1_709_565_592,
      initiator: {
        account_id: '9f030df0-0e12-4668-b4d3-758c8daec0ca',
        display_name: 'Авыаывы Уцукццук',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        vehicle_id: '0c5e1a38-ed26-4428-9e7f-bc48e96a4daf',
        ticket: {
          id: '688a85b9-51d2-4669-9b27-efe63febc2fb',
          type: TicketType.VEHICLE_TO_FLEET_ADDITION,
        },
      },
      has_additional_data: true,
    },
    {
      id: 'dcda4156-acec-455a-85a4-1844484c69c8',
      change_type: FleetHistoryType.OWNER_DELETED,
      occurred_at: 1_700_733_020,
      initiator: {
        account_id: 'f49e2709-22e2-4c59-baff-ba566244cb1f',
        display_name: 'n.test@uklon.com',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        user_id: '58229420-42e0-4c46-8ebd-2a45b03b8a67',
      },
      has_additional_data: true,
    },
    {
      id: '9f914665-cd62-4624-9a4f-d45f6dcca567',
      change_type: FleetHistoryType.DRIVER_REMOVED,
      occurred_at: 1_700_151_135,
      initiator: {
        account_id: '32174d5e-359e-4dbd-b5f9-4d42a38a4cee',
        display_name: 'Караванський Антон',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        driver_id: '5236ecb2-da73-4be8-8802-e1b202dd631e',
        user_id: '86854e41-e84f-4b84-b73e-7a1c214367a5',
      },
      has_additional_data: true,
    },
    {
      id: 'd15c568e-519f-4923-b54e-26c394fe2b2d',
      change_type: FleetHistoryType.PROFILE_CHANGED,
      occurred_at: 1_700_149_892,
      initiator: {
        account_id: '32174d5e-359e-4dbd-b5f9-4d42a38a4cee',
        display_name: 'Караванський Антон',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {},
      has_additional_data: true,
    },
    {
      id: 'fc14ed21-7789-490c-83ba-3ce051bbd102',
      change_type: FleetHistoryType.DRIVER_ADDED,
      occurred_at: 1_700_148_258,
      initiator: {
        account_id: '32174d5e-359e-4dbd-b5f9-4d42a38a4cee',
        display_name: 'Караванський Антон',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        driver_id: '5236ecb2-da73-4be8-8802-e1b202dd631e',
        user_id: '86854e41-e84f-4b84-b73e-7a1c214367a5',
      },
      has_additional_data: true,
    },
    {
      id: '881e5c6c-f755-4b40-a807-688b66b9c2d8',
      change_type: FleetHistoryType.VEHICLE_REMOVED,
      occurred_at: 1_687_880_352,
      initiator: {
        account_id: '6420baab-0031-4149-a846-4438ac6c789b',
        display_name: 'k.test@uklon.com',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        vehicle_id: '7f05a486-a178-4b87-8104-0acc0ea5732f',
      },
      has_additional_data: true,
    },
    {
      id: 'ca9251b3-65a2-480c-b815-3609b3d46ffe',
      change_type: FleetHistoryType.VEHICLE_ADDED,
      occurred_at: 1_687_880_238,
      initiator: {
        account_id: '6420baab-0031-4149-a846-4438ac6c789b',
        display_name: 'k.test@uklon.com',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        vehicle_id: '7f05a486-a178-4b87-8104-0acc0ea5732f',
      },
      has_additional_data: true,
    },
    {
      id: 'bf8ab8cd-d325-4910-8422-c4fcc800ea04',
      change_type: FleetHistoryType.DRIVER_REGISTERED,
      occurred_at: 1_685_008_362,
      initiator: {
        account_id: '6b25e890-c12f-4f56-9075-c8a674207526',
        display_name: 'leldenis8@gmail.com',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        driver_id: '1b3b35b8-5418-4c2d-b9bc-2a5c2a44b05a',
        user_id: 'b4804dbf-5a15-49db-bbd1-303707266978',
        ticket: {
          id: '893ab382-4523-4f89-a8e6-db08b1b630ab',
          type: 'RegistrationToFleet',
        },
      },
      has_additional_data: true,
    },
    {
      id: '7c7fe8e4-839e-40a7-9049-0226cec79b2e',
      change_type: FleetHistoryType.COMMERCIAL_CREATED,
      occurred_at: 1_684_737_417,
      initiator: {
        account_id: '6b25e890-c12f-4f56-9075-c8a674207526',
        display_name: 'leldenis8@gmail.com',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      has_additional_data: false,
    },
    {
      id: '4b71cc06-67e1-4853-9af8-cb8016f0300e',
      change_type: FleetHistoryType.MANAGER_ADDED,
      occurred_at: 1_711_361_260,
      initiator: {
        account_id: '353bf0a4-645c-4968-be55-30a683b538e7',
        display_name: 'sergei.l@uklon.com.ua',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      // @ts-expect-error because not all interfaces are implemented
      linked_entities: {
        user_id: '91511e41-2b7e-48a6-8d2f-27fd48a4c315',
      },
      has_additional_data: true,
    },
    {
      id: '4b71cc06-67e1-4853-9af8-cb8016f0300e',
      change_type: FleetHistoryType.WITHDRAWAL_TYPE_CHANGED,
      occurred_at: 1_712_758_827,
      initiator: {
        account_id: '9f030df0-0e12-4668-b4d3-758c8daec0ca',
        display_name: 'Авыаывы Уцукццук',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      has_additional_data: true,
    },
    {
      id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
      change_type: FleetHistoryType.INDIVIDUAL_ENTREPRENEUR_UPDATED,
      occurred_at: 1_712_922_035,
      initiator: {
        account_id: '9f030df0-0e12-4668-b4d3-758c8daec0ca',
        display_name: 'Авыаывы Уцукццук',
        type: HistoryInitiatorType.UKLON_MANAGER,
      },
      has_additional_data: true,
    },
    {
      id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
      change_type: FleetHistoryType.INDIVIDUAL_ENTREPRENEUR_SELECTED,
      occurred_at: 1_716_302_892,
      initiator: {
        account_id: 'f025dee3-a645-4c36-9e96-49881f507345',
        display_name: 'Owner Fleet',
        type: HistoryInitiatorType.FLEET_OWNER,
      },
      has_additional_data: true,
    },
    {
      id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
      change_type: FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED,
      occurred_at: 1_716_302_892,
      initiator: {
        account_id: 'f025dee3-a645-4c36-9e96-49881f507345',
        display_name: 'Owner Fleet',
        type: HistoryInitiatorType.FLEET_OWNER,
      },
      has_additional_data: true,
    },
    {
      id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
      change_type: FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
      occurred_at: 1_716_302_892,
      initiator: {
        account_id: 'f025dee3-a645-4c36-9e96-49881f507345',
        display_name: 'Owner Fleet',
        type: HistoryInitiatorType.FLEET_OWNER,
      },
      has_additional_data: true,
    },
  ],
};

export const HISTORY_ADDITIONAL_INFO_B2B_SPLIT_ADJUSTMENT_MOCK: FleetHistoryChangeItemDto = {
  id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
  change_type: FleetHistoryType.B2B_SPLIT_ADJUSTMENT_CHANGED,
  occurred_at: 1_712_922_035,
  initiator: {
    account_id: '9f030df0-0e12-4668-b4d3-758c8daec0ca',
    display_name: 'Авыаывы Уцукццук',
    type: HistoryInitiatorType.UKLON_MANAGER,
  },
  details: {
    old_value: 'TimeRange',
    current_value: 'PerSplit',
    update_type: 'Changed',
  },
};

export const HISTORY_ADDITIONAL_INFO_B2B_SPLIT_DISTRIBUTION_MOCK: FleetHistoryChangeItemDto = {
  id: 'f46f3e71-762c-42de-8ab6-2a8f24512228',
  change_type: FleetHistoryType.B2B_SPLIT_DISTRIBUTION_CHANGED,
  occurred_at: 1_712_922_035,
  initiator: {
    account_id: '9f030df0-0e12-4668-b4d3-758c8daec0ca',
    display_name: 'Авыаывы Уцукццук',
    type: HistoryInitiatorType.UKLON_MANAGER,
  },
  details: {
    old_value: 'ProportionalToCommission',
    current_value: 'BalanceDependent',
    update_type: 'Changed',
  },
};
