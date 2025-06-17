import { DefaultController } from '@api/common';
import { CursorCollectionOkResponse } from '@api/common/decorators/cursor-collection-ok-response.decorator';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { OrderStatus } from '@constant';
import {
  ActiveOrderItemDto,
  FleetCouriersDeliveriesCollectionDto,
  CourierDeliveriesQueryDto,
  FleetOrderRecordCollectionDto,
  FleetOrderRecordCollectionQueryDto,
  OrderRecordDto,
  OrderRecordQueryDto,
  CollectionCursorDto,
  CourierDeliveryItemDto,
} from '@data-access';
import {
  applyDecorators,
  ClassSerializerInterceptor,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import {
  CourierDeliveryItemEntity,
  DeliveryEntity,
  FleetDeliveryCollectionEntity,
  FleetOrderCollectionEntity,
  OrderEntity,
} from './entities';
import { OrdersService } from './orders.service';

const OrderCollectionResource = (): MethodDecorator =>
  applyDecorators(
    ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetOrderCollectionEntity }),
    ApiQuery({ name: 'fleetId', type: String }),
    ApiQuery({ name: 'driverId', type: String, required: false }),
    ApiQuery({ name: 'vehicleId', type: String, required: false }),
    ApiQuery({ name: 'licencePlate', type: String, required: false }),
    ApiQuery({ name: 'productType', type: String, required: false }),
    ApiQuery({ name: 'status', type: String, required: false }),
    ApiQuery({ name: 'from', type: String }),
    ApiQuery({ name: 'to', type: String }),
    ApiQuery({ name: 'cursor', type: String, required: false }),
    ApiQuery({ name: 'limit', type: String, required: false }),
  );

const OrderResource = (): MethodDecorator =>
  applyDecorators(
    ApiResponse({ status: HttpStatus.OK, description: 'Success', type: OrderEntity }),
    ApiParam({ name: 'orderId' }),
  );

@DefaultController('/fleets/orders', 'Fleet orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles' },
      { service: 'OR', method: 'GET', url: 'api/v2/driver-orders-history' },
      { service: 'P', method: 'GET', url: 'api/v1/drivers/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/basic-info' },
      { service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/individual-entrepreneurs' },
    ]),
  )
  @OrderCollectionResource()
  public getOrders(
    @Query() query: FleetOrderRecordCollectionQueryDto,
    @UserToken() token: Jwt,
  ): Observable<FleetOrderRecordCollectionDto> {
    return this.ordersService.getOrders(token, query);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:orderId')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'OR', method: 'GET', url: 'api/v1/drivers/{0}/orders-history/{1}' },
      { service: 'P', method: 'GET', url: 'api/v3/drivers/{0}' },
      { service: 'P', method: 'GET', url: 'api/v2/fleets/{0}/vehicles/{1}' },
      { service: 'P', method: 'GET', url: 'api/v1/drivers/{0}/images' },
      { service: 'P', method: 'GET', url: 'api/v1/vehicles/{0}/images' },
      { service: 'OP', method: 'GET', url: 'api/v1/orders/{0}/route-overview' },
    ]),
  )
  @OrderResource()
  public getOrderById(
    @Param('orderId') orderId: string,
    @Query() query: OrderRecordQueryDto,
    @UserToken() token: Jwt,
  ): Observable<OrderRecordDto> {
    return this.ordersService.getOrderById(token, orderId, query);
  }

  @Get('/drivers/:driverId/active-orders')
  @ApiOperation(buildApiOperationOptions([{ service: 'OP', method: 'GET', url: 'api/v1/drivers/{0}/active-orders' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', isArray: true })
  public getDriversActiveOrders(
    @UserToken() token: Jwt,
    @Param('driverId') driverId: string,
  ): Observable<ActiveOrderItemDto[]> {
    return this.ordersService.getDriversActiveOrders(driverId, token);
  }

  @Get('/couriers/:courierId/active-orders')
  @ApiOperation(buildApiOperationOptions([{ service: 'OR', method: 'GET', url: 'api/v1/couriers/{0}/active-orders' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', isArray: true })
  public getCouriersActiveOrders(
    @UserToken() token: Jwt,
    @Param('courierId') courierId: string,
    @Query('fleetId') fleetId: string,
  ): Observable<ActiveOrderItemDto[]> {
    return this.ordersService.getCouriersActiveOrders(courierId, fleetId, token);
  }

  @Get('/:orderId/route-overview')
  @ApiOperation(buildApiOperationOptions([{ service: 'OP', method: 'GET', url: 'api/v1/orders/{0}/route-overview' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: String })
  public getOrderRouteOverview(@UserToken() token: Jwt, @Param('orderId') orderId: string): Observable<string> {
    return this.ordersService.getRouteOverview(orderId, token);
  }

  @Get('/couriers/deliveries')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(buildApiOperationOptions([{ service: 'OR', method: 'GET', url: 'api/v1/courier-orders-history' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetDeliveryCollectionEntity })
  public getCouriersDeliveries(
    @UserToken() token: Jwt,
    @Query('fleet_id') fleet_id: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @Query('status') status: OrderStatus | '',
    @Query('limit') limit: number,
    @Query('cursor') cursor: number,
  ): Observable<FleetCouriersDeliveriesCollectionDto> {
    return this.ordersService.getCouriersDeliveries(token, { fleet_id, from, to, status, limit, cursor });
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/couriers/:courierId/deliveries')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'OP', method: 'GET', url: 'api/v1/couriers/{courier-id}/orders-history' }]),
  )
  @CursorCollectionOkResponse(CourierDeliveryItemEntity)
  public getCourierDeliveries(
    @UserToken() token: Jwt,
    @Param('courierId') courierId: string,
    @Query() query: CourierDeliveriesQueryDto,
  ): Observable<CollectionCursorDto<CourierDeliveryItemDto>> {
    return this.ordersService.getCourierDeliveries(token, courierId, query);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get('/:orderId/delivery')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'P', method: 'GET', url: '/api/v1/finance-mediators/{fleetId}/couriers/{courierId}' },
      { service: 'P', method: 'GET', url: '/api/v1/couriers/{courierId}/images' },
      { service: 'D', method: 'GET', url: '/api/v2/orders/{orderId}/route/overview' },
    ]),
  )
  @OrderResource()
  public getCourierDeliveryById(
    @UserToken() token: Jwt,
    @Param('orderId') orderId: string,
    @Query('courierId') courierId: string,
  ): Observable<DeliveryEntity> {
    return this.ordersService.getCourierDeliveryById(token, orderId, courierId);
  }
}
