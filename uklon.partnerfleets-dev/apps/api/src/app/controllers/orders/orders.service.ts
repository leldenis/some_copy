import { HttpControllerService } from '@api/common/http/http-controller.service';
import { DriversService } from '@api/controllers/drivers/drivers.service';
import { FinanceService } from '@api/controllers/finance/finance.service';
import { VehiclesService } from '@api/controllers/vehicles/vehicles.service';
import { DeliveryService, OrderProcessingService, OrderReportingService } from '@api/datasource';
import { PhotoSize } from '@constant';
import {
  ActiveOrderItemDto,
  CouriersDeliveriesQueryDto,
  FleetCouriersDeliveriesCollectionDto,
  CourierDeliveriesQueryDto,
  FleetDriverBasicInfoDto,
  FleetOrderRecordCollectionQueryDto,
  GatewayFleetOrderCollectionDto,
  GatewayOrderDto,
  OrderRecordQueryDto,
  OverviewPolylineDto,
  FleetCourierNameByIdDto,
  VehicleBasicInfoDto,
  GatewayOrderRouteDto,
  CollectionCursorDto,
  CourierDeliveryItemDto,
} from '@data-access';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { combineLatest, Observable, of, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Jwt } from '@uklon/nest-core';

import { CouriersService } from '../couriers/couriers.service';

import {
  DeliveryEntity,
  FleetDeliveryCollectionEntity,
  FleetOrderCollectionEntity,
  FleetOrderCollectionQueryEntity,
  OrderEntity,
  OrderQueryEntity,
} from './entities';

const DRIVER_ORDERS_HISTORY = 'api/v2/driver-orders-history';
const DRIVER_ORDER = 'api/v1/drivers/{0}/orders-history/{1}';

function getDriverIds(collection: GatewayFleetOrderCollectionDto): string[] {
  return collection.items.map((order) => order.driver_id?.replace(/-/g, ''));
}

function getVehicleIds(collection: GatewayFleetOrderCollectionDto): string[] {
  return collection.items.map((order) => order.vehicle_id?.replace(/-/g, ''));
}

function coerceVehicleLicenceMap(licences: VehicleBasicInfoDto[] = []): Map<string, VehicleBasicInfoDto> {
  return licences.reduce(
    (result, value) => result.set(value.vehicle_id.replace(/-/g, ''), value),
    new Map<string, VehicleBasicInfoDto>(),
  );
}

function coerceDriverMap(drivers: FleetDriverBasicInfoDto[] = []): Map<string, FleetDriverBasicInfoDto> {
  return drivers.reduce(
    (result, value) => result.set(value.driver_id.replace(/-/g, ''), value),
    new Map<string, FleetDriverBasicInfoDto>(),
  );
}

@Injectable()
export class OrdersService extends HttpControllerService {
  constructor(
    private readonly orderReportingService: OrderReportingService,
    private readonly driversService: DriversService,
    private readonly vehiclesService: VehiclesService,
    private readonly orderProcessingService: OrderProcessingService,
    private readonly couriersService: CouriersService,
    private readonly deliveryService: DeliveryService,
    private readonly financeService: FinanceService,
  ) {
    super();
  }

  public getDriversActiveOrders(driverId: string, token: Jwt): Observable<ActiveOrderItemDto[]> {
    return this.orderProcessingService
      .get<{ items: ActiveOrderItemDto[] }>(`api/v1/drivers/${driverId}/active-orders`, { token })
      .pipe(map(({ items }) => items));
  }

  public getCouriersActiveOrders(courierId: string, fleet_id: string, token: Jwt): Observable<ActiveOrderItemDto[]> {
    return this.orderReportingService
      .get<{ items: ActiveOrderItemDto[] }>(`api/v1/couriers/${courierId}/active-orders`, {
        token,
        params: { fleet_id, only_active_orders: true },
      })
      .pipe(map(({ items }) => items));
  }

  public getOrders(token: Jwt, query: FleetOrderRecordCollectionQueryDto): Observable<FleetOrderCollectionEntity> {
    const queryEntity = plainToInstance(FleetOrderCollectionQueryEntity, query, { exposeUnsetFields: false });
    const { licencePlate, fleetId } = queryEntity;
    let vehicleId$: Observable<string> = of('');
    if (licencePlate) {
      vehicleId$ = this.vehiclesService
        .getFleetVehicles(token, fleetId, licencePlate)
        .pipe(map((collection) => collection.items[0]?.id));
    }

    const url = this.buildUrl(DRIVER_ORDERS_HISTORY);
    return vehicleId$.pipe(
      switchMap((id) => {
        if (id) queryEntity.vehicleId = id;

        const params = instanceToPlain(queryEntity, { exposeUnsetFields: false, excludeExtraneousValues: true });

        return this.orderReportingService.get<GatewayFleetOrderCollectionDto>(url, { params, token });
      }),
      switchMap((collection) => {
        const drivers = this.getFleetOrderCollectionDrivers(token, collection);
        const vehicles = this.getFleetOrderCollectionVehicles(token, collection);
        const entrepreneurs = this.financeService.getFleetEntrepreneurs(token, query.fleetId, false);
        return combineLatest([drivers, vehicles, entrepreneurs]).pipe(
          map(([d, v, e]) => new FleetOrderCollectionEntity(collection, d, v, e.items)),
        );
      }),
    );
  }

  public getOrderById(token: Jwt, orderId: string, query: OrderRecordQueryDto): Observable<OrderEntity> {
    const queryEntity = plainToInstance(OrderQueryEntity, query, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    const url = this.buildUrl(DRIVER_ORDER, queryEntity.driverId, orderId);

    return this.orderReportingService.get<GatewayOrderDto>(url, { token }).pipe(
      switchMap((order) => {
        const driver = this.driversService.getFleetDriverById(token, order.fleet_id, order.driver_id);
        const vehicle = this.vehiclesService.getFleetVehicleById(token, order.fleet_id, order.vehicle_id).pipe(
          catchError((error: AxiosError, _) => {
            if (error?.response?.status === HttpStatus.NOT_FOUND) {
              return of(null);
            }
            return throwError(error);
          }),
        );
        const driverPhotos = this.driversService.getDriverPhotos(token, order.driver_id, PhotoSize.SMALL);
        const vehiclePhotos = this.vehiclesService.getFleetVehiclePhotos(token, order.vehicle_id, PhotoSize.SMALL);
        const overviewPolyline = this.getRouteOverview(orderId, token);
        return combineLatest([driver, vehicle, driverPhotos, vehiclePhotos, overviewPolyline]).pipe(
          map(([d, v, dp, vp, op]) => new OrderEntity(order, d, v, dp, vp, op)),
          catchError((err, _) => throwError(() => err)),
        );
      }),
    );
  }

  public getRouteOverview(orderId: string, token: Jwt): Observable<string> {
    return this.orderProcessingService
      .get<OverviewPolylineDto>(`api/v1/orders/${orderId}/route-overview`, { token })
      .pipe(
        map(({ overwiew_polyline }) => overwiew_polyline),
        catchError(() => of('')),
      );
  }

  public getDeliveryRouteOverview(orderId: string, token: Jwt): Observable<string> {
    return this.deliveryService
      .get<Pick<GatewayOrderRouteDto, 'overview_polyline'>>(`api/v2/orders/${orderId}/route/overview`, { token })
      .pipe(
        map(({ overview_polyline }) => overview_polyline),
        catchError(() => of('')),
      );
  }

  public getCouriersDeliveries(
    token: Jwt,
    params: CouriersDeliveriesQueryDto,
  ): Observable<FleetCouriersDeliveriesCollectionDto> {
    return this.orderReportingService.get('api/v1/courier-orders-history', { params, token }).pipe(
      switchMap((collection) => {
        const ids = collection.items.map(({ courier_id }) => courier_id);
        const request = ids.length > 0 ? this.couriersService.getCouriersNamesByIds(token, ids) : of([]);

        return request.pipe(
          map((couriers) => {
            const couriersMap = new Map<string, FleetCourierNameByIdDto>();
            couriers.forEach((courier) => couriersMap.set(courier.courier_id.replace(/-/g, ''), courier));
            return new FleetDeliveryCollectionEntity(collection, couriersMap);
          }),
        );
      }),
    );
  }

  public getCourierDeliveries(
    token: Jwt,
    courierId: string,
    params: CourierDeliveriesQueryDto,
  ): Observable<CollectionCursorDto<CourierDeliveryItemDto>> {
    return this.orderReportingService.get(`/api/v1/couriers/${courierId}/orders-history`, { params, token });
  }

  public getCourierDeliveryById(token: Jwt, orderId: string, courierId: string): Observable<DeliveryEntity> {
    return this.orderReportingService.get(`/api/v1/couriers/${courierId}/orders-history/${orderId}`, { token }).pipe(
      switchMap((delivery) => {
        const overviewPolyline = this.getDeliveryRouteOverview(delivery.uid, token);
        const fleetCourier = this.couriersService.getFleetCourierById(token, delivery.fleet_id, courierId);
        const courierPhotos = this.couriersService.getCourierPhotos(token, courierId, PhotoSize.SMALL);

        return combineLatest([fleetCourier, courierPhotos, overviewPolyline]).pipe(
          map(([courier, photos, polyline]) => new DeliveryEntity(delivery, courier, photos, polyline)),
        );
      }),
    );
  }

  private getFleetOrderCollectionVehicles(
    jwt: Jwt,
    collection: GatewayFleetOrderCollectionDto,
  ): Observable<Map<string, VehicleBasicInfoDto>> {
    const rawIds = getVehicleIds(collection).map((id) => {
      const parts = [id.slice(0, 8), id.slice(8, 12), id.slice(12, 16), id.slice(16, 20), id.slice(20, id.length)];
      return parts.join('-');
    });
    const ids = new Set(rawIds);

    if (ids.size === 0) {
      return of(new Map<string, VehicleBasicInfoDto>());
    }

    const request = this.vehiclesService.getFleetVehicleBasicInfo(jwt, [...ids]);

    return request.pipe(map(({ items }) => coerceVehicleLicenceMap(items)));
  }

  private getFleetOrderCollectionDrivers(
    jwt: Jwt,
    collection: GatewayFleetOrderCollectionDto,
  ): Observable<Map<string, FleetDriverBasicInfoDto>> {
    const ids = new Set(getDriverIds(collection));

    if (ids.size === 0) {
      return of(new Map<string, FleetDriverBasicInfoDto>());
    }

    const request = this.driversService.getDriverBasicInfo(jwt, [...ids]);

    return request.pipe(map((drivers) => coerceDriverMap(drivers)));
  }
}
