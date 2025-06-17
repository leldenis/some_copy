import { BonusesModule } from '@api/controllers/bonuses/bonuses.module';
import { CouriersModule } from '@api/controllers/couriers/couriers.module';
import { FiscalizationModule } from '@api/controllers/fiscalization/fiscalization.module';
import { SurveysModule } from '@api/controllers/surveys/surveys.module';
import { UklonGarageModule } from '@api/controllers/uklon-garage/uklon-garage.module';
import { Global, Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { RegionsModule } from './dictionaries/dictionaries.module';
import { DriversModule } from './drivers/drivers.module';
import { FinanceModule } from './finance/finance.module';
import { FleetModule } from './fleet/fleet.module';
import { GeolocationModule } from './geolocation/gelocation.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { ReportsModule } from './reports';
import { StatisticsModule } from './statistics/statistics.module';
import { TicketsModule } from './tickets/tickets.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Global()
@Module({
  imports: [
    HealthModule,
    AuthModule,
    AccountModule,
    AnalyticsModule,
    RegionsModule,
    VehiclesModule,
    OrdersModule,
    DriversModule,
    TicketsModule,
    FinanceModule,
    ReportsModule,
    ContactsModule,
    StatisticsModule,
    GeolocationModule,
    CouriersModule,
    FleetModule,
    BonusesModule,
    SurveysModule,
    NotificationsModule,
    FiscalizationModule,
    UklonGarageModule,
  ],
})
export class ControllerModule {}
