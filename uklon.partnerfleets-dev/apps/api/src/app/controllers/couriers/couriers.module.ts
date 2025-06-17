import { CouriersController } from '@api/controllers/couriers/couriers.controller';
import { CouriersService } from '@api/controllers/couriers/couriers.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [CouriersController],
  providers: [CouriersService],
})
export class CouriersModule {}
