import { PhotosEntity } from '@api/common/entities/photos.entitiy';
import { CourierDetailsDto, FleetDriverDto, OrderRecordDriverDto, PhotosDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class OrderEmployeeEntity implements OrderRecordDriverDto {
  @Exclude()
  private readonly employee: FleetDriverDto | CourierDetailsDto;

  @Exclude()
  private readonly employeePhotos: PhotosDto;

  @Expose()
  @Type(() => String)
  public get email(): string {
    return this.employee.email;
  }

  @Expose()
  @Type(() => String)
  public get fullName(): string {
    return `${this.employee.last_name} ${this.employee.first_name}`;
  }

  @Expose()
  @Type(() => String)
  public get id(): string {
    return this.employee.id;
  }

  @Expose()
  @Type(() => String)
  public get phone(): string {
    return this.employee.phone;
  }

  @Expose()
  @Type(() => String)
  public get rating(): number {
    return this.isDriver(this.employee) ? this.employee.rating : this.employee.rating.value;
  }

  @Expose()
  @Type(() => String)
  public get signal(): number {
    return this.isDriver(this.employee) ? this.employee.signal : null;
  }

  @Expose()
  @Type(() => PhotosEntity)
  public get photos(): PhotosDto {
    return this.employeePhotos;
  }

  constructor(employee: FleetDriverDto | CourierDetailsDto, employeePhotos: PhotosDto) {
    this.employee = employee;
    this.employeePhotos = employeePhotos;
  }

  @Exclude()
  private isDriver(driver: FleetDriverDto | CourierDetailsDto): driver is FleetDriverDto {
    return !!(driver as FleetDriverDto)?.signal;
  }
}
