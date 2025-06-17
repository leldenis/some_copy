import { ApiErrorResponseEntity } from '@api/common/entities/api-error-response.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { AccountDto } from '@data-access';
import { Controller, Get, UseGuards, Put, Body, Req, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { Observable, of } from 'rxjs';

import { AuthGuard, Jwt, UserToken } from '@uklon/nest-core';

import { AccountService } from './account.service';
import { AccountEntity } from './entities/account.entity';

@ApiTags('Me')
@Controller('/me')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'GET', url: 'api/v1/fleets/me' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: AccountEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getMe(@UserToken() token: Jwt): Observable<AccountDto> {
    return this.accountService.getMe(token);
  }

  @Put('/send-verification-code')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'POST', url: 'api/v1/me/send-verification-code' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public sendVerificationCode(@UserToken() token: Jwt): Observable<void> {
    return this.accountService.sendVerificationCode(token);
  }

  @Get('/user-country')
  @ApiOperation(buildApiOperationOptions())
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: Object })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getUserCountry(@Req() { headers }: Request): Observable<{ country: string }> {
    const country = ((headers['cf-ipcountry'] || headers['x-amzn-waf-ipcountry']) as string)?.toUpperCase();

    return of({ country: country ?? null });
  }

  @Put('/change-password')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/me/fleets/password' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public changePassword(@Body() body: { password: string }, @UserToken() token: Jwt): Observable<void> {
    return this.accountService.changePassword(token, body);
  }

  @Put('/update-locale')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation(buildApiOperationOptions([{ service: 'P', method: 'PUT', url: 'api/v1/me/locale' }]))
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public updateLocale(@Body() body: { locale: string }, @UserToken() token: Jwt): Observable<void> {
    return this.accountService.updateLocale(token, body);
  }
}
