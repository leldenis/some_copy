import { readFileSync } from 'fs';
import path from 'node:path';

import { environment } from '@api-env/environment';
import { KafkaConfig } from '@api-env/environment.model';
import { WEBSOCKET_PATH } from '@constant';
import { NotificationEventDto, WsEvent } from '@data-access';
import { SchemaRegistry, SchemaType } from '@kafkajs/confluent-schema-registry';
import { Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { LogLevel } from '@nestjs/common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Consumer, Kafka, PartitionAssigners } from 'kafkajs';
import { merge } from 'lodash';
import { Server, Socket } from 'socket.io';
import { RemoteSocket } from 'socket.io/dist/broadcast-operator';
import type { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { Jwt, JwtPayload } from '@uklon/nest-core';

import { PartitionAssigner } from './utils/partitions-assigner';

const DEFAULT_HEARTBEAT_INTERVAL = 3000;
const DEFAULT_CONNECTION_TIMEOUT = 10_000;

interface SocketData {
  accountId: string;
  fleetId?: string;
}

type NotificationServer = Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;
type NotificationSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>;

@WebSocketGateway({ path: WEBSOCKET_PATH, cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
  @WebSocketServer()
  protected readonly server?: NotificationServer;

  protected kafkaConsumer?: Consumer;

  protected schemaRegistry?: SchemaRegistry;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly configService: ConfigService) {}

  @SubscribeMessage(WsEvent.FLEET_CHANGED)
  public async onFleetChanged(
    @ConnectedSocket() socket: NotificationSocket,
    @MessageBody() body: { fleetId: string },
  ): Promise<void> {
    try {
      this.log(`[${WsEvent.FLEET_CHANGED}] Processing message with fleetId: ${body?.fleetId}`, 'debug', socket);
      if (body?.fleetId) {
        // eslint-disable-next-line no-param-reassign
        socket.data = merge(socket?.data, { fleetId: body.fleetId });
        this.log(`[${WsEvent.FLEET_CHANGED}] Updated socket data: fleetId - ${body.fleetId}`, 'debug', socket);
      }
    } catch (error) {
      this.log(`[${WsEvent.FLEET_CHANGED}] Error processing message: ${error}`, 'error', socket);
    }
  }

  public async onModuleInit(): Promise<void> {
    try {
      const kafkaConfig = this.configService.get<KafkaConfig>('kafka');

      if (!kafkaConfig?.enabled) {
        this.log('Kafka functionality disabled (kafkaConfig.enabled is false)', 'warn');
        return;
      }

      this.log('Initializing Kafka consumer...', 'debug');
      await this.initKafka(kafkaConfig);

      this.log('Registering event handlers for Kafka messages...', 'debug');
      await this.registerEvent();

      this.log('Starting Kafka consumer to process messages...', 'debug');
      await this.kafkaConsumer.run({
        eachMessage: async (message) => this.handleKafkaEvent(message),
      });
    } catch (error) {
      this.log(`Error initializing Kafka consumer: ${error}`, 'error');
    }
  }

  public async onModuleDestroy(): Promise<void> {
    if (this.kafkaConsumer) {
      this.log('Disconnecting Kafka consumer...', 'debug');
      try {
        await this.kafkaConsumer.disconnect();
        this.log('Kafka consumer disconnected successfully.', 'debug');
      } catch (error) {
        this.log(`Error disconnecting Kafka consumer: ${error}`, 'error');
      }
    }
  }

  public handleConnection(socket: NotificationSocket): void {
    this.log(`Client connected`, 'debug', socket);
    const token = socket?.handshake?.query?.token as string;
    if (!token) {
      socket.disconnect();
      this.log(`No token found in handshake. Skipping account ID retrieval`, 'debug', socket);
      return;
    }

    try {
      this.log('Attempting to decode JWT token to retrieve account ID...', 'debug', socket);

      const jwt = new Jwt(token);
      const jwtPayload = new JwtPayload(jwt?.payload);
      const accountId = jwtPayload?.NameId;

      if (accountId) {
        // eslint-disable-next-line no-param-reassign
        socket.data = merge(socket?.data, { accountId });
        this.log(`Successfully parsed JWT from request and extracted accountId: ${accountId}`, 'debug', socket);
      } else {
        this.log(`No accountId found in token body`, 'warn', socket);
        socket.disconnect();
      }
    } catch (error) {
      this.log(`Error occurred while decoding JWT token: ${error}`, 'warn', socket);
      socket.disconnect();
    }
  }

  public handleDisconnect(socket: Socket): void {
    this.log(`Client disconnected`, 'debug', socket);
  }

  private async initKafka(kafkaConfig: KafkaConfig): Promise<void> {
    try {
      const kafka = new Kafka({
        clientId: kafkaConfig.clientId,
        brokers: kafkaConfig.bootstrapServers?.split(',') ?? [],
        ssl: kafkaConfig.sslEnabled,
        sasl: {
          mechanism: kafkaConfig.saslMechanism,
          username: kafkaConfig.saslUsername,
          password: kafkaConfig.saslPassword,
        },
        connectionTimeout: kafkaConfig.connectionTimeout || DEFAULT_CONNECTION_TIMEOUT,
      });
      this.log('Created Kafka client with configuration details', 'debug');

      // Retrieve and log Kafka group ID
      const groupId = this.getKafkaGroupId(kafkaConfig);
      this.log(`Retrieved Kafka groupId: ${groupId}`, 'debug');

      // Determine and log heartbeat interval
      const heartbeatInterval = kafkaConfig.heartbeatInterval || DEFAULT_HEARTBEAT_INTERVAL;
      this.log(`Using heartbeat interval: ${heartbeatInterval} ms.`, 'debug');

      // Initialize Kafka consumer with retrieved details
      this.kafkaConsumer = kafka.consumer({
        groupId,
        partitionAssigners: [PartitionAssigner, PartitionAssigners.roundRobin],
        heartbeatInterval,
      });
      this.log('Initialized Kafka consumer', 'debug');

      // Connect Kafka consumer
      await this.kafkaConsumer.connect();
      this.log('Connected Kafka consumer', 'debug');

      // Subscribe to topics (log number of topics)
      const numTopics = kafkaConfig?.topics?.length ?? 0;
      this.log(`Subscribed Kafka consumer to ${numTopics} topic(s)`, 'debug');
      await this.kafkaConsumer.subscribe({ topics: kafkaConfig.topics });

      this.schemaRegistry = new SchemaRegistry({ host: kafkaConfig.schemaRegistry.host });
      this.log('Initialized Schema Registry client', 'debug');
    } catch (error) {
      this.log(`Error initializing Kafka: ${error}`, 'error');
    }
  }

  private getKafkaGroupId(config: KafkaConfig): string {
    let groupId = `${config.clientId}-gateway`;

    if (!environment.production) {
      groupId += '-local';
    }

    return groupId;
  }

  private async handleKafkaEvent({ message, heartbeat }): Promise<void> {
    // Check for message existence and value before processing
    if (!message?.value) {
      this.log('Received empty Kafka message', 'warn');
      return;
    }

    const sockets = await this.server.fetchSockets();
    if (!sockets?.length) {
      this.log('No sockets found for processing', 'debug');
      return;
    }

    try {
      const notificationEvent: NotificationEventDto = await this.schemaRegistry.decode(message.value);
      this.log(`Decoded Kafka message to NotificationEvent object: ${JSON.stringify(notificationEvent)}`, 'debug');

      if (!notificationEvent?.notification?.fleetId || !notificationEvent?.notification?.receiverAccountId) {
        this.log('Missing fleetId or receiverAccountId in notification data', 'warn');
        return;
      }

      const { notification } = notificationEvent;

      const clientIds = sockets
        .filter((socket) => {
          if (!socket?.data) {
            this.log(`Socket found without payload: ${socket?.id}`, 'debug', socket);
            return false;
          }

          const { accountId, fleetId } = socket.data;

          return accountId === notification?.receiverAccountId && fleetId === notification?.fleetId;
        })
        .map((socket) => socket.id);

      if (!clientIds?.length) {
        this.log(
          `Notification does not match fleet or account filters: fleetId - ${notification?.fleetId}, accountId - ${notification?.receiverAccountId}`,
          'debug',
        );
        return;
      }

      this.log(`Notification matches fleet and account filters: ${clientIds.join(',')}`, 'debug');
      this.server.to(clientIds).emit(WsEvent.NOTIFICATIONS, notificationEvent);
    } catch (error) {
      this.log(`Error processing Kafka message: ${error}`, 'error');
    } finally {
      // Ensure heartbeat call even if processing fails
      await heartbeat();
    }
  }

  private async registerEvent(): Promise<void> {
    try {
      const schemaSubject = 'partnerfleets';

      // eslint-disable-next-line unicorn/prefer-module
      const data = readFileSync(path.join(__dirname, 'assets', 'proto', `partner_fleets_event.proto`));
      this.log('Successfully read partner fleets event proto file', 'debug');

      await this.schemaRegistry.register(
        {
          type: SchemaType.PROTOBUF,
          schema: data.toString(),
        },
        {
          subject: schemaSubject,
        },
      );
      this.log(`Registered partner fleets event schema with subject: ${schemaSubject}`, 'debug');
    } catch (error) {
      this.log(`Error registering schema with schema registry: ${error}`, 'error');
    }
  }

  private log(
    message: string,
    level: LogLevel = 'log',
    socket?: NotificationSocket | RemoteSocket<DefaultEventsMap, SocketData>,
  ): string {
    if (!socket) {
      this.logger[level](message);
      return;
    }

    this.logger[level](
      `${message}. SocketId: ${socket?.id}. AccountId: ${socket?.data?.accountId}. FleetId: ${socket?.data?.fleetId}.`,
    );
  }
}
