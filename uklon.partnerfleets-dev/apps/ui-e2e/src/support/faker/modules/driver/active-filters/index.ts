import {
  DriverFilter,
  DriverOrderFilterDto,
  DriverOrderFiltersCollectionDto,
  DriverOrderFilterTypeVersion,
  FeeType,
  LocalityType,
} from '@data-access';

import { Currency } from '@uklon/types';

import { ModuleBase } from '../../_internal';

export interface BuildProps {
  count: number;
  filters: DriverFilter[];
  type_version?: DriverOrderFilterTypeVersion;
  enabled?: {
    distance?: boolean;
    payment?: boolean;
    minimal_tariff_distance?: boolean;
    minimal_tariff_cost?: boolean;
    min_cost_per_km?: boolean;
    min_cost_per_suburban_km?: boolean;
    include_source_sectors?: boolean;
    include_destination_sectors?: boolean;
    pickup_time?: boolean;
    minimal_tariff_per_km?: boolean;
    cost_minimal?: boolean;
    cost_minimal_per_km?: boolean;
    tariff?: boolean;
    cost?: boolean;
    locality?: boolean;
  };
}

const FILTERS_MAP = {
  [DriverFilter.OFFER]: {
    for_offer: true,
    offer_enabled_at: 1_743_598_146,
    for_broadcast: false,
    broadcast_enabled_at: 0,
    for_loop: false,
    loop_enabled_at: 0,
  },
  [DriverFilter.BROADCAST]: {
    for_offer: false,
    offer_enabled_at: 0,
    for_broadcast: true,
    broadcast_enabled_at: 1_743_598_146,
    for_loop: false,
    loop_enabled_at: 0,
  },
  [DriverFilter.LOOP_FILTER]: {
    for_offer: false,
    offer_enabled_at: 0,
    for_broadcast: false,
    broadcast_enabled_at: 0,
    for_loop: true,
    loop_enabled_at: 1_743_598_146,
  },
} as const;

export class DriverActiveFiltersModule extends ModuleBase<DriverOrderFiltersCollectionDto, BuildProps> {
  public buildDto(props?: BuildProps): DriverOrderFiltersCollectionDto {
    // eslint-disable-next-line complexity
    const order_filters = Array.from({ length: props.count }).map((_, index) => {
      const filterType = props.filters[index];

      return {
        filter_id: `${index}`,
        name: filterType ?? 'random',
        offer_enabled_at: FILTERS_MAP[filterType].offer_enabled_at ?? 0,
        for_offer: FILTERS_MAP[filterType].for_offer ?? false,
        broadcast_enabled_at: FILTERS_MAP[filterType].broadcast_enabled_at ?? 0,
        for_broadcast: FILTERS_MAP[filterType].for_broadcast ?? false,
        loop_enabled_at: FILTERS_MAP[filterType].loop_enabled_at ?? 0,
        for_loop: FILTERS_MAP[filterType].for_loop ?? false,
        type_version: props?.type_version ?? DriverOrderFilterTypeVersion.V1,
        filters: {
          distance: {
            max_distance_km: 12.899,
            is_enabled: props?.enabled?.distance ?? true,
          },
          payment: {
            payment_types: [FeeType.CASH, FeeType.CASHLESS],
            is_enabled: props?.enabled?.payment ?? true,
          },
          tariff: props?.enabled?.tariff
            ? {
                minimal_tariff_distance: {
                  distance_km: 2,
                  is_enabled: props?.enabled?.minimal_tariff_distance ?? true,
                },
                minimal_tariff_cost: {
                  cost: 1,
                  currency_code: Currency.UAH,
                  is_enabled: props?.enabled?.minimal_tariff_cost ?? true,
                },
                min_cost_per_km: {
                  cost: 3,
                  currency_code: Currency.UAH,
                  is_enabled: props?.enabled?.min_cost_per_km ?? true,
                },
                min_cost_per_suburban_km: {
                  cost: 4,
                  currency_code: Currency.UAH,
                  is_enabled: props?.enabled?.min_cost_per_suburban_km ?? true,
                },
                is_enabled: true,
              }
            : null,
          include_source_sectors: {
            sector_ids: ['ea387d4c-2ed6-45ae-b855-a7d9dcfad98f'],
            is_enabled: props?.enabled?.include_source_sectors ?? true,
            sectors_tags: [
              [
                {
                  name: 'name',
                  value: 'АКАДЕММІСТЕЧКО',
                },
                {
                  name: 'name:en',
                  value: 'AKADEMMISTECHKO',
                },
                {
                  name: 'name:ru',
                  value: 'АКАДЕМГОРОДОК',
                },
                {
                  name: 'name:uk',
                  value: 'АКАДЕММІСТЕЧКО',
                },
              ],
            ],
          },
          include_destination_sectors: {
            sector_ids: ['ea387d4c-2ed6-45ae-b855-a7d9dcfad98f'],
            is_enabled: props?.enabled?.include_destination_sectors ?? true,
            sectors_tags: [
              [
                {
                  name: 'name',
                  value: 'АКАДЕММІСТЕЧКО',
                },
                {
                  name: 'name:en',
                  value: 'AKADEMMISTECHKO',
                },
                {
                  name: 'name:ru',
                  value: 'АКАДЕМГОРОДОК',
                },
                {
                  name: 'name:uk',
                  value: 'АКАДЕММІСТЕЧКО',
                },
              ],
            ],
          },
          exclude_source_sectors: {
            sector_ids: [],
            is_enabled: false,
            sectors_tags: [],
          },
          exclude_destination_sectors: {
            sector_ids: [],
            is_enabled: false,
            sectors_tags: [],
          },
          pickup_time: {
            order_pickup_time_type: 'deferred',
            is_enabled: props?.enabled?.pickup_time ?? true,
          },
          cost: props?.enabled?.cost
            ? {
                minimal: {
                  value: 5,
                  currency_code: Currency.UAH,
                  is_enabled: props?.enabled?.cost_minimal ?? true,
                },
                minimal_per_km: {
                  value: 6,
                  currency_code: Currency.UAH,
                  is_enabled: props?.enabled?.cost_minimal_per_km ?? true,
                },
              }
            : null,
          locality: {
            type: [LocalityType.CITY],
            is_enabled: props?.enabled?.locality ?? true,
          },
        },
      } as DriverOrderFilterDto;
    });

    return { order_filters };
  }
}
