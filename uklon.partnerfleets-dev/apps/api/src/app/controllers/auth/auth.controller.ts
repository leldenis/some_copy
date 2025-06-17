import { ApiErrorResponseEntity } from '@api/common/entities/api-error-response.entity';
import { buildApiOperationOptions } from '@api/common/utils/swagger/build-api-operation-options';
import { AuthService } from '@api/controllers/auth/auth.service';
import {
  AuthConfirmationDto,
  AuthConfirmationMethodDto,
  AuthenticationDto,
  IdentityDto,
  SendPhoneVerificationCodeDto,
} from '@data-access';
import { Body, Controller, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import {
  AuthConfirmationEntity,
  AuthConfirmationMethodEntity,
  AuthenticationEntity,
} from './entities/authentication.entity';
import { IdentityEntity } from './entities/identity.entity';
import { SendPhoneVerificationCodeEntity } from './entities/send-phone-verification-code.entity';

@ApiTags('Authentication')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  @ApiOperation(
    buildApiOperationOptions([
      { service: 'I', method: 'POST', url: 'api/v2/auth' },
      { service: 'P', method: 'POST', url: 'api/v1/fleets/me' },
    ]),
  )
  @ApiBody({ type: AuthenticationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: IdentityEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public auth(@Body() body: AuthenticationDto): Observable<IdentityDto> {
    return this.authService.auth(body);
  }

  @Post('/refresh')
  @ApiOperation(buildApiOperationOptions([{ service: 'I', method: 'POST', url: 'api/v2/auth' }]))
  @ApiBody({ type: AuthenticationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: IdentityEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public authRefresh(@Body() body: AuthenticationDto): Observable<IdentityDto> {
    return this.authService.authRefresh(body);
  }

  @Post('/send-otc')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'I', method: 'POST', url: 'api/v1/confirmation/phone/send-code' }]),
  )
  @ApiBody({ type: SendPhoneVerificationCodeEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  public sendOTC(@Body() body: SendPhoneVerificationCodeDto): Observable<void> {
    return this.authService.sendOTC(body);
  }

  @Put('/confirmation-method')
  @ApiOperation(
    buildApiOperationOptions([{ service: 'I', method: 'PUT', url: 'api/v1/confirmation/phone/confirmation-method' }]),
  )
  @ApiBody({ type: AuthConfirmationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: AuthConfirmationMethodEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public getConfirmationMethod(@Body() body: AuthConfirmationDto): Observable<AuthConfirmationMethodDto> {
    return this.authService.getConfirmationMethod(body);
  }

  @Put('/reset-password')
  @ApiOperation(buildApiOperationOptions([{ service: 'I', method: 'PUT', url: 'api/v1/accounts/reset' }]))
  @ApiBody({ type: AuthConfirmationEntity })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request', type: ApiErrorResponseEntity })
  public resetPassword(@Body() body: SendPhoneVerificationCodeDto): Observable<void> {
    return this.authService.resetPassword(body);
  }
}
