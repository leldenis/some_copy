import { ApiErrorResponseEntity } from '@api/common/entities';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { FleetContactDto, FleetUserNameByIdDto } from '@data-access';
import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { ContactsService } from './contacts.service';
import { FleetContactEntity } from './entities/fleet-contact.entity';
import { FleetUserNameByIdEntity } from './entities/user-name-by-id.entity';

@ApiTags('Fleet contacts')
@Controller('/fleets')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden', type: ApiErrorResponseEntity })
@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found', type: ApiErrorResponseEntity })
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('/:fleetId/contacts')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/{0}' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetContactEntity })
  public getFleetContacts(@Param('fleetId') fleetId: string, @UserToken() token: Jwt): Observable<FleetContactDto[]> {
    return this.contactsService.getFleetContacts(token, fleetId);
  }

  @Get('/users-names')
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/users/names' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: FleetUserNameByIdEntity })
  public getUserNamesById(@Query('id') id: string[], @UserToken() token: Jwt): Observable<FleetUserNameByIdDto[]> {
    return this.contactsService.getUserNamesById(token, id);
  }
}
