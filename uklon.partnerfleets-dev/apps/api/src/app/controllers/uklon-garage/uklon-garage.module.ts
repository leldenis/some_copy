import { Module } from '@nestjs/common';

import { UklonGarageController } from './uklon-garage.controller';
import { UklonGarageService } from './uklon-garage.service';

@Module({
  controllers: [UklonGarageController],
  providers: [UklonGarageService],
})
export class UklonGarageModule {}
