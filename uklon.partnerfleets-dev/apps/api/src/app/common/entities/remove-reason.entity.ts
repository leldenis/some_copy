import { DriverRemovalReason, VehicleRemovalReason } from '@constant';
import { RemoveReasonDto } from '@data-access';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveReasonEntity implements RemoveReasonDto {
  @ApiProperty({ type: String })
  public reason: VehicleRemovalReason | DriverRemovalReason;

  @ApiProperty({ type: String })
  public comment: string;
}
