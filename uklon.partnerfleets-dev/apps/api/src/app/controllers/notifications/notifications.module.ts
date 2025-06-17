import { NotificationsGateway } from '@api/controllers/notifications/notifications.gateway';
import { Module } from '@nestjs/common';

import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
})
export class NotificationsModule {}
