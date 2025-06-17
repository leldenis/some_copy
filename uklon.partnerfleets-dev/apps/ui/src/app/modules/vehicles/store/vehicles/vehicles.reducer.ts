import { TicketStatus } from '@constant';
import {
  FleetVehicleCashierPosDto,
  FleetVehicleCollectionDto,
  PaginationCollectionDto,
  PhotosDto,
  VehicleDetailsDto,
  VehicleProductConfigurationCollectionDto,
  VehicleTicketDto,
} from '@data-access';
import { createReducer, on } from '@ngrx/store';
import { VehicleTicketsFilterDto } from '@ui/modules/vehicles/models/vehicle-tickets-filter.dto';
import { vehiclesActions } from '@ui/modules/vehicles/store/vehicles/vehicles.actions';

export interface VehiclesState {
  loading: boolean;
  vehiclesCollection: FleetVehicleCollectionDto;
  isVehiclesCollectionError: boolean;
  vehiclesTicketsCollection: PaginationCollectionDto<VehicleTicketDto>;
  isVehiclesTicketsCollectionError: boolean;
  vehiclesTicketsFilter: VehicleTicketsFilterDto;
  vehicleDetails: VehicleDetailsDto;
  vehicleProductConfigurations: VehicleProductConfigurationCollectionDto;
  vehiclePhotos: PhotosDto;
  vehiclePhotosLg: PhotosDto;
  vehicleTicketPhotos: PhotosDto;
  vehicleTicketPhotosLg: PhotosDto;
  vehicleTicketDeleted: boolean;
  vehicleCashPoint: FleetVehicleCashierPosDto;
  ticketId: string;
}

export const initialState: VehiclesState = {
  loading: false,
  vehiclesCollection: null,
  isVehiclesCollectionError: false,
  vehiclesTicketsCollection: null,
  isVehiclesTicketsCollectionError: false,
  vehiclesTicketsFilter: {
    license_plate: '',
    status: TicketStatus.ALL,
  },
  vehicleDetails: null,
  vehicleProductConfigurations: null,
  vehiclePhotos: null,
  vehiclePhotosLg: null,
  vehicleTicketPhotos: null,
  vehicleTicketPhotosLg: null,
  vehicleTicketDeleted: null,
  vehicleCashPoint: null,
  ticketId: null,
};

export const vehiclesReducer = createReducer(
  initialState,

  on(vehiclesActions.getFleetVehicles, (state) => ({
    ...state,
    loading: true,
    isVehiclesCollectionError: false,
  })),

  on(vehiclesActions.getFleetVehiclesSuccess, (state, vehiclesCollection) => ({
    ...state,
    loading: false,
    vehiclesCollection,
  })),

  on(vehiclesActions.getFleetVehiclesFailed, (state) => ({
    ...state,
    loading: false,
    vehiclesCollection: null,
    isVehiclesCollectionError: true,
  })),

  on(vehiclesActions.getFleetVehicleById, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.getFleetVehicleByIdSuccess, (state, { vehicleDetails }) => ({
    ...state,
    loading: false,
    vehicleDetails,
  })),

  on(vehiclesActions.getFleetVehicleByIdFailed, (state) => ({
    ...state,
    loading: false,
    vehicleDetails: null,
  })),

  on(vehiclesActions.getFleetVehicleProductConfigurations, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.getFleetVehicleProductConfigurationsSuccess, (state, productConfigurations) => ({
    ...state,
    loading: false,
    vehicleProductConfigurations: productConfigurations,
  })),

  on(vehiclesActions.getFleetVehicleProductConfigurationsFailed, (state) => ({
    ...state,
    loading: false,
    vehicleProductConfigurations: null,
  })),

  on(vehiclesActions.updateFleetVehicleProductConfigurations, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.updateFleetVehicleProductConfigurationsSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.updateFleetVehicleProductConfigurationsFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.deleteFleetVehicleById, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.deleteFleetVehicleByIdSuccess, vehiclesActions.deleteFleetVehicleByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.postFleetVehicleById, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.postFleetVehicleByIdSuccess, vehiclesActions.postFleetVehicleByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.postFleetVehicleTicketById, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.postFleetVehicleTicketByIdSuccess, (state, { tiket_id }) => ({
    ...state,
    loading: false,
    ticketId: tiket_id,
  })),

  on(vehiclesActions.postFleetVehicleTicketByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.releaseFleetVehicleById, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.releaseFleetVehicleByIdSuccess, vehiclesActions.releaseFleetVehicleByIdFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.getFleetVehiclePhotos, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.getFleetVehiclePhotosSuccess, (state, vehiclePhotos) => ({
    ...state,
    loading: false,
    vehiclePhotos,
  })),

  on(vehiclesActions.getFleetVehiclePhotosFailed, (state) => ({
    ...state,
    loading: false,
    vehiclePhotos: null,
  })),

  on(vehiclesActions.getFleetVehiclePhotosLgSuccess, (state, vehiclePhotosLg) => ({
    ...state,
    loading: false,
    vehiclePhotosLg,
  })),

  on(vehiclesActions.getFleetVehiclePhotosLgFailed, (state) => ({
    ...state,
    loading: false,
    vehiclePhotosLg: null,
  })),

  on(vehiclesActions.getVehicleTicketPhotos, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.getVehicleTicketPhotosSuccess, (state, { photos }) => ({
    ...state,
    loading: false,
    vehicleTicketPhotos: photos,
  })),

  on(vehiclesActions.getVehicleTicketPhotosFailed, (state) => ({
    ...state,
    loading: false,
    vehicleTicketPhotos: null,
  })),

  on(vehiclesActions.getVehicleTicketPhotosLgSuccess, (state, { photos }) => ({
    ...state,
    loading: false,
    vehicleTicketPhotosLg: photos,
  })),

  on(vehiclesActions.getVehicleTicketPhotosLgFailed, (state) => ({
    ...state,
    loading: false,
    vehicleTicketPhotosLg: null,
  })),

  on(vehiclesActions.getFleetVehiclesTickets, (state) => ({
    ...state,
    loading: true,
    isVehiclesTicketsCollectionError: false,
  })),

  on(vehiclesActions.getFleetVehiclesTicketsSuccess, (state, vehiclesTicketsCollection) => ({
    ...state,
    loading: false,
    vehiclesTicketsCollection,
  })),

  on(vehiclesActions.getFleetVehiclesTicketsFailed, (state) => ({
    ...state,
    loading: false,
    vehiclesTicketsCollection: {
      ...initialState.vehiclesTicketsCollection,
    },
    isVehiclesTicketsCollectionError: true,
  })),

  on(vehiclesActions.clearFleetVehiclesCreationTicketState, (state) => ({
    ...state,
    loading: true,
    vehicleSelectedBodyType: null,
    ticketId: null,
  })),

  on(vehiclesActions.setVehicleCreationTicketSentStatus, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.setVehicleCreationTicketSentStatusSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.setVehicleCreationTicketSentStatusFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(vehiclesActions.deleteTicket, (state) => ({
    ...state,
    loading: true,
    vehicleTicketDeleted: false,
  })),

  on(vehiclesActions.deleteTicketSuccess, (state) => ({
    ...state,
    loading: false,
    vehicleTicketDeleted: true,
  })),

  on(vehiclesActions.deleteTicketFailed, (state) => ({
    ...state,
    loading: false,
    vehicleTicketDeleted: false,
  })),

  on(vehiclesActions.getFleetVehiclePointOfSale, (state) => ({
    ...state,
    loading: true,
  })),

  on(vehiclesActions.getFleetVehiclePointOfSaleSuccess, (state, { cashPoint }) => ({
    ...state,
    loading: false,
    vehicleCashPoint: cashPoint,
  })),

  on(vehiclesActions.getFleetVehiclePointOfSaleFailed, (state) => ({
    ...state,
    loading: false,
    vehicleCashPoint: null,
  })),

  on(vehiclesActions.clearFleetVehiclePhotos, (state) => ({
    ...state,
    vehiclePhotos: null,
    vehiclePhotosLg: null,
  })),

  on(vehiclesActions.clearFleetVehicleCreationTicketPhotos, (state) => ({
    ...state,
    vehicleTicketPhotos: null,
    vehicleTicketPhotosLg: null,
  })),

  on(vehiclesActions.clearVehicleCashPoint, (state) => ({
    ...state,
    vehicleCashPoint: null,
  })),

  on(vehiclesActions.clearState, () => ({
    ...initialState,
  })),
);
