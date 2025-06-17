import { FleetDriverBasicInfoDto, FleetWithArchivedDriversBasicInfoDto } from '@data-access';
import { Exclude, Expose, Type } from 'class-transformer';

export class FleetWithArchivedDriversBasicInfoEntity implements FleetWithArchivedDriversBasicInfoDto {
  @Exclude()
  private readonly driver: FleetWithArchivedDriversBasicInfoDto;

  @Expose()
  @Type(() => String)
  public get first_name(): string {
    return this.driver.first_name;
  }

  @Expose()
  @Type(() => String)
  public get last_name(): string {
    return this.driver.last_name;
  }

  @Expose()
  @Type(() => String)
  public get phone(): string {
    return this.driver.phone;
  }

  @Expose()
  @Type(() => String)
  public get driver_id(): string {
    return this.driver.driver_id;
  }

  @Expose()
  @Type(() => Number)
  public get rating(): number {
    return this.driver.rating;
  }

  @Expose()
  @Type(() => Number)
  public get signal(): number {
    return this.driver.signal;
  }

  constructor(driver: FleetDriverBasicInfoDto) {
    this.driver = driver;
  }
}
