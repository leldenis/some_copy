import { FleetAccessGuard } from '@api/common/guards';
import { AccountService } from '@api/controllers/account/account.service';
import { FiscalService } from '@api/controllers/fiscalization/fiscal.service';
import { FiscalizationController } from '@api/controllers/fiscalization/fiscalization.controller';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FiscalizationController],
  providers: [FiscalService, VehiclesService, FleetAccessGuard, AccountService],
})
export class FiscalizationModule {}
