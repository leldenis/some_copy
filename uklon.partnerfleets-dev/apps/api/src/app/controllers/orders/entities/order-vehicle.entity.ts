import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { OrderRecordVehicleDto, PhotosDto, VehicleDetailsDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class OrderVehicleEntity implements OrderRecordVehicleDto {
  @Expose()
  @Type(() => String)
  public productType: string;

  @Exclude()
  private readonly vehicle: VehicleDetailsDto;

  @Exclude()
  private readonly vehiclePhotos: PhotosDto;

  @Expose()
  @Type(() => String)
  public get id(): string {
    return this.vehicle.id;
  }

  @Expose()
  @Type(() => String)
  public get licencePlate(): string {
    return this.vehicle.license_plate;
  }

  @Expose()
  @Type(() => String)
  public get make(): string {
    return this.vehicle.make;
  }

  @Expose()
  @Type(() => String)
  public get model(): string {
    return this.vehicle.model;
  }

  @Expose()
  @Type(() => String)
  public get year(): string {
    return `${this.vehicle.production_year}`;
  }

  @Expose()
  @Type(() => PhotosEntity)
  public get photos(): PhotosDto {
    return this.vehiclePhotos;
  }

  constructor(vehicle: VehicleDetailsDto, productType: string, vehiclePhotos: PhotosDto) {
    this.productType = productType;
    this.vehicle = vehicle;
    this.vehiclePhotos = vehiclePhotos;
  }
}
