import { BodyType, LoadCapacity } from '@constant';
import {
  DictionaryRecordDto,
  FleetVehicleAboutDto,
  FleetVehicleColor,
  FleetVehicleFuel,
  FleetVehicleOption,
  GatewayFleetVehicleDto,
} from '@data-access';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

export class DictionaryRecordEntity implements DictionaryRecordDto {
  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public id: string;

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class FleetVehicleAboutEntity implements FleetVehicleAboutDto {
  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: FleetVehicleColor, enumName: 'FleetVehicleColor' })
  public get color(): FleetVehicleColor {
    return this.vehicle.color as FleetVehicleColor;
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: FleetVehicleFuel, enumName: 'FleetVehicleFuel', isArray: true })
  public get fuels(): FleetVehicleFuel[] {
    return this.vehicle.fuels as FleetVehicleFuel[];
  }

  @Expose()
  @Type(() => DictionaryRecordEntity)
  @ApiProperty({ type: DictionaryRecordEntity })
  public get maker(): DictionaryRecordDto {
    return new DictionaryRecordEntity(this.vehicle.make_id, this.vehicle.make);
  }

  @Expose()
  @Type(() => DictionaryRecordEntity)
  @ApiProperty({ type: DictionaryRecordEntity })
  public get model(): DictionaryRecordDto {
    return new DictionaryRecordEntity(this.vehicle.model_id, this.vehicle.model);
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: FleetVehicleOption, enumName: 'FleetVehicleOption', isArray: true })
  public get options(): FleetVehicleOption[] {
    return this.vehicle.options as FleetVehicleOption[];
  }

  @Expose()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  public get productionYear(): number {
    return this.vehicle.production_year;
  }

  @Expose()
  @Type(() => Number)
  @ApiProperty({ type: Number })
  public get seats(): number {
    return this.vehicle.passenger_seats_count;
  }
  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: BodyType, enumName: 'BodyType' })
  public get bodyType(): BodyType {
    return this.vehicle.body_type;
  }

  @Expose()
  @Type(() => String)
  @ApiProperty({ enum: LoadCapacity, enumName: 'LoadCapacity' })
  public get loadCapacity(): LoadCapacity {
    return this.vehicle.load_capacity;
  }

  @Exclude()
  private readonly vehicle: GatewayFleetVehicleDto;

  constructor(vehicle: GatewayFleetVehicleDto) {
    this.vehicle = vehicle;
  }
}
