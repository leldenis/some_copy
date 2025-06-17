import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActiveOrderItemDto,
  CouriersDeliveriesQueryDto,
  FleetCouriersDeliveriesCollectionDto,
  CourierDeliveriesQueryDto,
  FleetOrderRecordDto,
  FleetOrderRecordCollectionDto,
  FleetOrderRecordCollectionQueryDto,
  OrderRecordDto,
  DeliveryRecordDto,
  CollectionCursorDto,
  CourierDeliveryItemDto,
} from '@data-access';
import { HttpClientService } from '@ui/core/services/http-client.service';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';

const FLEET_ORDERS_URL = 'api/fleets/orders';
const FLEET_ORDER_BY_ID_URL = `${FLEET_ORDERS_URL}/{0}`;

@Injectable({ providedIn: 'root' })
export class OrdersService extends HttpClientService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  public getFleetOrders(
    params: Partial<FleetOrderRecordCollectionQueryDto>,
  ): Observable<FleetOrderRecordCollectionDto> {
    return this.http.get<FleetOrderRecordCollectionDto>(this.buildUrl(FLEET_ORDERS_URL), { params });
  }

  public getFleetOrderById(orderId: string, driverId: string): Observable<OrderRecordDto> {
    const params = { driverId };
    return this.http.get<OrderRecordDto>(this.buildUrl(FLEET_ORDER_BY_ID_URL, orderId), { params });
  }

  public getFleetOrdersByIds(orderIds: string[], driverId: string): Observable<FleetOrderRecordDto[]> {
    const requests = orderIds.map((id) => this.getFleetOrderById(id, driverId));
    return forkJoin(requests).pipe(catchError(() => of(null)));
  }

  public getDriverActiveOrders(driverId: string, orderId?: string): Observable<ActiveOrderItemDto[]> {
    return this.http
      .get<ActiveOrderItemDto[]>(this.buildUrl(`api/fleets/orders/drivers/{0}/active-orders`, driverId))
      .pipe(
        map((orders) => {
          const sortedOrders = orders?.length > 0 ? orders.sort((a, b) => a.pickup_time - b.pickup_time) : [];

          return orderId ? sortedOrders.filter(({ order_id }) => order_id === orderId) : sortedOrders;
        }),
      );
  }

  public getCourierActiveOrders(
    courierId: string,
    fleetId: string,
    orderId?: string,
  ): Observable<ActiveOrderItemDto[]> {
    const params = new HttpParams({ fromObject: { fleetId } });
    return this.http
      .get<ActiveOrderItemDto[]>(`api/fleets/orders/couriers/${courierId}/active-orders`, { params })
      .pipe(
        map((orders) => {
          const sortedOrders = orders?.length > 0 ? orders.sort((a, b) => a.pickup_time - b.pickup_time) : [];

          return orderId ? sortedOrders.filter(({ order_id }) => order_id === orderId) : sortedOrders;
        }),
      );
  }

  public getFleetCouriersDeliveries(
    query: CouriersDeliveriesQueryDto,
  ): Observable<FleetCouriersDeliveriesCollectionDto> {
    const params = new HttpParams({ fromObject: { ...query } });
    return this.http
      .get<FleetCouriersDeliveriesCollectionDto>('api/fleets/orders/couriers/deliveries', { params })
      .pipe(catchError(() => of({ items: [], cursor: null })));
  }

  public getCourierDeliveries(
    courierId: string,
    query: CourierDeliveriesQueryDto,
  ): Observable<CollectionCursorDto<CourierDeliveryItemDto>> {
    const params = new HttpParams({ fromObject: { ...query } });
    return this.http.get<CollectionCursorDto<CourierDeliveryItemDto>>(
      `api/fleets/orders/couriers/${courierId}/deliveries`,
      { params },
    );
  }

  public getCourierDeliveryById(orderId: string, courierId: string): Observable<DeliveryRecordDto> {
    const params = { courierId };
    return this.http.get<DeliveryRecordDto>(`api/fleets/orders/${orderId}/delivery`, { params });
  }
}
