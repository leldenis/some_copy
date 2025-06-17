import { FinanceService } from '@api/controllers/finance/finance.service';
import { Module } from '@nestjs/common';

import { ContactsService } from '../contacts/contacts.service';
import { DriversService } from '../drivers/drivers.service';
import { VehiclesService } from '../vehicles/vehicles.service';

import { FleetController } from './fleet.controller';
import { FleetService } from './fleet.service';

@Module({
  controllers: [FleetController],
  providers: [FleetService, VehiclesService, DriversService, ContactsService, FinanceService],
})
export class FleetModule {}
