import { DriversService } from '@api/controllers/drivers/drivers.service';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { Module } from '@nestjs/common';

import { CouriersService } from '../couriers/couriers.service';

import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, VehiclesService, DriversService, CouriersService, FinanceService],
})
export class OrdersModule {}
