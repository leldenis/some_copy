import { FinanceService } from '@api/controllers/finance/finance.service';
import { Module } from '@nestjs/common';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, FinanceService],
})
export class ReportsModule {}
