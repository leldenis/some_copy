import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiExcludeController, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

@ApiTags('Health')
@ApiExcludeController()
@Controller('/v1/health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-operation
  @Get('/')
  @HealthCheck()
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public async healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([
      async () => ({
        apiVersion: {
          status: 'up',
        },
      }),
    ]);
  }
}
