import {
  BlockedListStatusValue,
  DriverPhotoControlCreatingReason,
  DriverVehicleAccessType,
  KarmaGroup,
  TicketStatus,
} from '@constant';
import {
  DriverDetailsPhotoControlDto,
  DriverKarmaDto,
  DriverSelectedVehicleDto,
  EmployeeRestrictionDetailsDto,
  FleetDriverDto,
} from '@data-access';

import { ModuleBase } from '../_internal';

export type BuildProps = Partial<{
  status: BlockedListStatusValue;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  karma: DriverKarmaDto;
  vehicle: DriverSelectedVehicleDto;
  accessType: DriverVehicleAccessType;
  photo_control: DriverDetailsPhotoControlDto;
  deadline_to_send: number;
  restrictions: EmployeeRestrictionDetailsDto[];
}>;

export class DriverModule extends ModuleBase<FleetDriverDto, BuildProps> {
  // eslint-disable-next-line complexity
  public buildDto(props?: BuildProps): FleetDriverDto {
    return {
      id: '1fad966a-b2f4-427b-a0da-4b04be5f871f',
      status: {
        value: props?.status ?? BlockedListStatusValue.ACTIVE,
      },
      first_name: props?.firstName ?? 'Aqadpilu404',
      last_name: props?.lastName ?? 'Aqaafeyh404',
      phone: props?.phone ?? '380506326599',
      license: 'abkix',
      signal: 500_265,
      email: props?.email ?? '404linct@uklon.aqa',
      rating: 500,
      karma: props?.karma ?? {
        calculation_metrics: {
          completed_count: 0,
          rejected_count: 0,
          canceled_count: 0,
        },
        orders_to_calculation: 0,
        reset_count: 0,
        group: KarmaGroup.FIRST_PRIORITY,
        value: 100,
      },
      employed_from: 1_666_359_379,
      selected_vehicle: props?.vehicle ?? {
        vehicle_id: 'b5bbf6ca-dec6-4073-a1db-4b3bb4dd171c',
        license_plate: 'AQA0001',
        make: 'Aston Martin',
        model: 'Vulcan',
        currentFleet: true,
        fleet_id: '*',
      },
      access_type: props?.accessType ?? DriverVehicleAccessType.ALL,
      restrictions: Array.isArray(props?.restrictions) ? props.restrictions : [],
      photo_control: props?.photo_control ?? {
        ticket_id: 'adbc420f-af9c-4ddc-8cf3-1aefe0c2d251',
        deadline_to_send: props?.deadline_to_send ?? 1_735_793_865,
        block_immediately: false,
        status: TicketStatus.DRAFT,
        reasons: [DriverPhotoControlCreatingReason.DOCUMENTS_ACTUALIZATION],
        reason_comment: 'some photo missed',
      },
    };
  }
}
