import { VehiclePhotosCategory } from '@constant';
import { FleetRole, VehicleTicketConfigDto } from '@data-access';

import { ModuleBase } from '../_internal';

export class TicketConfigurationModule extends ModuleBase<VehicleTicketConfigDto, void> {
  public buildDto(): VehicleTicketConfigDto {
    return this.buildItem();
  }

  private buildItem(): VehicleTicketConfigDto {
    return {
      available_picture_types: [
        VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
        VehiclePhotosCategory.DRIVER_REGISTRATION_FRONT,
        VehiclePhotosCategory.DRIVER_REGISTRATION_BACK,
        VehiclePhotosCategory.VEHICLE_ANGLED_FRONT,
        VehiclePhotosCategory.VEHICLE_ANGLED_BACK,
        VehiclePhotosCategory.VEHICLE_FRONT,
        VehiclePhotosCategory.VEHICLE_BACK,
        VehiclePhotosCategory.VEHICLE_LEFT,
        VehiclePhotosCategory.VEHICLE_RIGHT,
        VehiclePhotosCategory.VEHICLE_INTERIOR_FRONT,
        VehiclePhotosCategory.DRIVER_TAXI_LICENSE_FRONT,
        VehiclePhotosCategory.DRIVER_TAXI_LICENSE_REVERSE,
        VehiclePhotosCategory.DRIVER_INSURANCE_FRONT,
      ],
      required_picture_types: [
        VehiclePhotosCategory.VEHICLE_INTERIOR_BACK,
        VehiclePhotosCategory.DRIVER_REGISTRATION_FRONT,
        VehiclePhotosCategory.DRIVER_REGISTRATION_BACK,
        VehiclePhotosCategory.VEHICLE_ANGLED_FRONT,
        VehiclePhotosCategory.VEHICLE_ANGLED_BACK,
      ],
      is_clarification_supported: false,
      available_diia_docs: [],
      properties_configurations: [
        {
          property_name: 'color',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'options',
          shown_for: [FleetRole.MANAGER],
        },
        {
          property_name: 'fuels',
          shown_for: [FleetRole.MANAGER],
        },
        {
          property_name: 'body_type',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'production_year',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'model_id',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'license_plate',
          shown_for: [FleetRole.MANAGER],
        },
        {
          property_name: 'vin_code',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'comfort_level',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'passenger_seats_count',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'load_capacity',
          shown_for: [FleetRole.MANAGER],
          is_required: true,
        },
        {
          property_name: 'additional_pictures_types',
          shown_for: [FleetRole.MANAGER],
        },
      ],
      picture_types: [],
    };
  }
}
