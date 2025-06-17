import { BonusesController } from '@api/controllers/bonuses/bonuses.controller';
import { BonusesService } from '@api/controllers/bonuses/bonuses.service';
import { DriversService } from '@api/controllers/drivers/drivers.service';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [BonusesController],
  providers: [BonusesService, VehiclesService, DriversService, FinanceService],
})
export class BonusesModule {}
