import { DestroyRef, Inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WEBSOCKET_PATH } from '@constant';
import { NotificationEventDto, WsEvent } from '@data-access';
import { select, Store } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { NotificationsService } from '@ui/core/services/notifications.service';
import { StorageService, storageUserKey } from '@ui/core/services/storage.service';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { getSelectedFleet } from '@ui/core/store/account/account.selectors';
import { getIsLoggedInUser } from '@ui/core/store/auth/auth.selectors';
import { EnvironmentModel } from '@ui-env/environment.model';
import { filter } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

import { APP_CONFIG } from '@uklon/angular-core';

@Injectable()
export class WebsocketService {
  private socket: Socket;

  constructor(
    private readonly store: Store<AccountState>,
    private readonly notificationsService: NotificationsService,
    private readonly destroyRef: DestroyRef,
    private readonly storage: StorageService,
    @Inject(APP_CONFIG) private readonly appConfig: EnvironmentModel,
  ) {
    if (!this.appConfig?.notifications?.enableWebSockets) return;
    this.initConnection();
  }

  private get token(): string {
    return this.storage.get<UserDto>(storageUserKey)?.accessToken;
  }

  public handleNewEvents(): void {
    this.socket.on(WsEvent.NOTIFICATIONS, (data: NotificationEventDto) => {
      if (data.notification.isBulk) {
        this.notificationsService.updateCustomCount();
      }

      this.notificationsService.updateCount();
      this.notificationsService.handleNewEvent(data);
    });
  }

  public disconnect(): void {
    if (!this.socket?.connected) return;

    this.socket.removeAllListeners();
    this.socket.disconnect();
  }

  public sendMessage<T>(event: WsEvent, data: T): void {
    if (!this.socket?.connected) return;
    this.socket.emit(event, data);
  }

  private connect(): void {
    this.socket = io({
      path: WEBSOCKET_PATH,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      query: { token: this.token },
    });
  }

  private onConnected(): void {
    this.socket.on(WsEvent.CONNECT, () => {
      this.store
        .select(getSelectedFleet)
        .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef))
        .subscribe(({ id }) =>
          this.sendMessage<{ fleetId: string }>(WsEvent.FLEET_CHANGED, {
            fleetId: id,
          }),
        );
    });
  }

  private initConnection(): void {
    this.store
      .pipe(
        select(getIsLoggedInUser),
        filter((isLoggedIn) => isLoggedIn),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        if (this.socket?.connected) return;

        this.connect();
        this.onConnected();
        this.handleNewEvents();
      });
  }
}
