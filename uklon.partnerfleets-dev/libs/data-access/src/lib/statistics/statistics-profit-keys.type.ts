import { StatisticOrderProfitDto } from '../statistic-details';

export type StatisticsProfitKeysType = keyof Omit<StatisticOrderProfitDto, 'total'> | string;
