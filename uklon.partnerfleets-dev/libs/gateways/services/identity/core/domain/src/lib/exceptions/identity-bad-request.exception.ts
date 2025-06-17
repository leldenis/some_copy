import { HttpException, HttpStatus } from '@nestjs/common';

import { IdentityServiceErrorDto } from '@uklon/gateways/services/identity/core/types';

export class IdentityBadRequestException extends HttpException {
  constructor(response: IdentityServiceErrorDto) {
    super(response, HttpStatus.BAD_REQUEST);
  }
}
