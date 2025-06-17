import { ApiErrorResponseEntity } from '@api/common/entities';
import { applyDecorators, Controller, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

export const DefaultController = (path: string, description: string): ClassDecorator => {
  return applyDecorators(
    ApiTags(description),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity }),
    ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity }),
    ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity }),
    Controller(path),
    ApiBearerAuth(),
  );
};
