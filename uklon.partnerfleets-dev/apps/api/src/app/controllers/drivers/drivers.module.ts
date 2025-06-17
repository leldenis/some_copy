import { DriversPhotoControlService } from '@api/controllers/drivers/services';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { Module } from '@nestjs/common';

import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { FleetService } from './services/fleet.service';

@Module({
  controllers: [DriversController],
  providers: [DriversService, FleetService, FinanceService, VehiclesService, DriversPhotoControlService],
})
export class DriversModule {}
