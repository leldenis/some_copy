import { PhotoSize, TicketStatus } from '@constant';
import {
  FleetVehicleCashierPosDto,
  FleetVehicleCollectionDto,
  FleetVehicleCollectionQueryDto,
  PaginationCollectionDto,
  PhotosDto,
  ProductConfigurationUpdateItemCollectionDto,
  RemoveReasonDto,
  TicketDto,
  VehicleDetailsDto,
  VehicleProductConfigurationCollectionDto,
  VehicleTicketCreationDto,
  VehicleTicketDto,
  VehicleTicketUpdateDto,
} from '@data-access';
import { createAction, props } from '@ngrx/store';

const tag = '[vehicles]';

export const vehiclesActions = {
  getFleetVehicles: createAction(`${tag} get fleet vehicles`, props<FleetVehicleCollectionQueryDto>()),
  getFleetVehiclesSuccess: createAction(`${tag} get fleet vehicles success`, props<FleetVehicleCollectionDto>()),
  getFleetVehiclesFailed: createAction(`${tag} get fleet vehicles failed`),

  getFleetVehicleById: createAction(
    `${tag} get fleet vehicle by id`,
    props<{
      fleetId: string;
      vehicleId: string;
    }>(),
  ),
  getFleetVehicleByIdSuccess: createAction(
    `${tag} get fleet vehicle by id success`,
    props<{ vehicleDetails: VehicleDetailsDto }>(),
  ),
  getFleetVehicleByIdFailed: createAction(`${tag} get fleet vehicle by id failed`),

  getFleetVehicleProductConfigurations: createAction(
    `${tag} get fleet vehicle product configurations`,
    props<{
      fleetId: string;
      vehicleId: string;
    }>(),
  ),
  getFleetVehicleProductConfigurationsSuccess: createAction(
    `${tag} get fleet vehicle product configurations success`,
    props<VehicleProductConfigurationCollectionDto>(),
  ),
  getFleetVehicleProductConfigurationsFailed: createAction(`${tag} get fleet vehicle product configurations failed`),

  updateFleetVehicleProductConfigurations: createAction(
    `${tag} update fleet vehicle product configurations`,
    props<{
      fleetId: string;
      vehicleId: string;
      body: ProductConfigurationUpdateItemCollectionDto;
    }>(),
  ),
  updateFleetVehicleProductConfigurationsSuccess: createAction(
    `${tag} update fleet vehicle product configurations success`,
  ),
  updateFleetVehicleProductConfigurationsFailed: createAction(
    `${tag} update fleet vehicle product configurations failed`,
  ),

  deleteFleetVehicleById: createAction(
    `${tag} delete fleet vehicle by id`,
    props<{
      fleetId: string;
      vehicleId: string;
      body: RemoveReasonDto;
    }>(),
  ),
  deleteFleetVehicleByIdSuccess: createAction(`${tag} delete fleet vehicle by id success`),
  deleteFleetVehicleByIdFailed: createAction(`${tag} delete fleet vehicle by id failed`),

  postFleetVehicleById: createAction(
    `${tag} post fleet vehicle by id`,
    props<{
      fleetId: string;
      vehicleId: string;
      body: VehicleTicketCreationDto;
    }>(),
  ),
  postFleetVehicleByIdSuccess: createAction(
    `${tag} post fleet vehicle by id success`,
    props<{
      license_plate: string;
    }>(),
  ),
  postFleetVehicleByIdFailed: createAction(`${tag} post fleet vehicle by id failed`),

  postFleetVehicleTicketById: createAction(
    `${tag} post fleet vehicle ticket by id`,
    props<{
      fleetId: string;
      vehicleId: string;
      body: Partial<VehicleTicketCreationDto>;
    }>(),
  ),
  postFleetVehicleTicketByIdSuccess: createAction(
    `${tag} post fleet vehicle ticket by id success`,
    props<{
      tiket_id: string;
    }>(),
  ),
  postFleetVehicleTicketByIdFailed: createAction(`${tag} post fleet vehicle ticket by id failed`),

  releaseFleetVehicleById: createAction(
    `${tag} release fleet vehicle by id`,
    props<{
      fleetId: string;
      vehicleId: string;
    }>(),
  ),
  releaseFleetVehicleByIdSuccess: createAction(`${tag} release fleet vehicle by id success`),
  releaseFleetVehicleByIdFailed: createAction(`${tag} release fleet vehicle by id failed`),

  getFleetVehiclePhotos: createAction(
    `${tag} get fleet vehicle photos`,
    props<{
      fleetId: string;
      vehicleId: string;
      image_size: PhotoSize;
    }>(),
  ),
  getFleetVehiclePhotosSuccess: createAction(`${tag} get fleet vehicle photos success`, props<PhotosDto>()),
  getFleetVehiclePhotosFailed: createAction(`${tag} get fleet vehicle photos failed`),

  getFleetVehiclePhotosLgSuccess: createAction(`${tag} get fleet vehicle photos LG success`, props<PhotosDto>()),
  getFleetVehiclePhotosLgFailed: createAction(`${tag} get fleet vehicle photos LG failed`),

  getVehicleTicketPhotos: createAction(
    `${tag} get vehicle ticket photos`,
    props<{
      ticketId: string;
      image_size: PhotoSize;
    }>(),
  ),
  getVehicleTicketPhotosSuccess: createAction(
    `${tag} get vehicle ticket photos success`,
    props<{ photos: PhotosDto }>(),
  ),
  getVehicleTicketPhotosFailed: createAction(`${tag} get vehicle ticket photos failed`),

  getVehicleTicketPhotosLgSuccess: createAction(
    `${tag} get vehicle ticket photos LG success`,
    props<{ photos: PhotosDto }>(),
  ),
  getVehicleTicketPhotosLgFailed: createAction(`${tag} get vehicle ticket photos LG failed`),

  getFleetVehiclesTickets: createAction(
    `${tag} get fleet vehicles tickets`,
    props<{
      fleetId: string;
      license_plate?: string;
      status?: TicketStatus | '';
      limit?: number;
      offset?: number;
    }>(),
  ),
  getFleetVehiclesTicketsSuccess: createAction(
    `${tag} get fleet vehicles tickets success`,
    props<PaginationCollectionDto<VehicleTicketDto>>(),
  ),
  getFleetVehiclesTicketsFailed: createAction(`${tag} get fleet vehicles tickets failed`),

  updateFleetVehiclesCreationTicket: createAction(
    `${tag} update fleet creation vehicle tickets`,
    props<{ ticketId: string; form: VehicleTicketUpdateDto; skipSendStatus?: boolean }>(),
  ),
  updateFleetVehiclesCreationTicketSuccess: createAction(`${tag} update fleet vehicles creation ticket success`),
  updateFleetVehiclesCreationTicketFailed: createAction(`${tag} update fleet creation vehicle tickets failed`),

  setVehicleCreationTicketSentStatus: createAction(
    `${tag} update vehicle creation ticket status to sent`,
    props<TicketDto>(),
  ),
  setVehicleCreationTicketSentStatusSuccess: createAction(
    `${tag} update vehicle creation ticket status to sent success`,
  ),
  setVehicleCreationTicketSentStatusFailed: createAction(`${tag} update vehicle creation ticket status to sent failed`),

  deleteTicket: createAction(`${tag} delete ticket`, props<{ ticketId: string }>()),
  deleteTicketSuccess: createAction(`${tag} delete ticket success`),
  deleteTicketFailed: createAction(`${tag} delete ticket failed`),

  getFleetVehiclePointOfSale: createAction(
    `${tag} get fleet vehicle point of sale`,
    props<{
      fleetId: string;
      vehicleId: string;
    }>(),
  ),
  getFleetVehiclePointOfSaleSuccess: createAction(
    `${tag} get fleet vehicle point of sale success`,
    props<{ cashPoint: FleetVehicleCashierPosDto }>(),
  ),
  getFleetVehiclePointOfSaleFailed: createAction(`${tag} get fleet vehicle point of sale failed`),

  openUnlinkCashPointFromVehicleModal: createAction(
    `${tag} open unlink cash point from vehicle`,
    props<{ point: FleetVehicleCashierPosDto }>(),
  ),

  clearFleetVehiclesCreationTicketState: createAction(`${tag} get fleet vehicle creation ticket state`),
  clearFleetVehicleCreationTicketPhotos: createAction(`${tag} clear fleet vehicle creation ticket photos`),

  clearFleetVehiclePhotos: createAction(`${tag} clear fleet vehicle photos`),

  clearVehicleDetailsPage: createAction(`${tag} clear vehicle details page`),

  clearVehicleCreatePage: createAction(`${tag} clear vehicle create page`),

  clearVehicleCashPoint: createAction(`${tag} clear vehicle cash point`),

  clearState: createAction(`${tag} clear vehicles state`),
};
