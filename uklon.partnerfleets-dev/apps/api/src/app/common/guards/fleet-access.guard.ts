import { AccountService } from '@api/controllers/account/account.service';
import { FleetRole } from '@data-access';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { map, Observable } from 'rxjs';

import { HttpRequest, Jwt } from '@uklon/nest-core';

@Injectable()
export class FleetAccessGuard implements CanActivate {
  constructor(private readonly accountService: AccountService) {}

  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const httpRequest = new HttpRequest(request);
    const token = httpRequest.getToken();
    const fleetId = request?.params?.fleetId;

    if (!fleetId) {
      throw new ForbiddenException();
    }

    if (this.isTokenEmpty(token)) {
      throw new UnauthorizedException();
    }

    return this.accountService.getMe(token).pipe(
      map((response) => {
        const fleetFound = response.fleets.find((fleet) => fleet?.id === fleetId && fleet?.role === FleetRole.OWNER);
        if (!fleetFound) {
          throw new ForbiddenException();
        }
        return true;
      }),
    );
  }

  private isTokenEmpty(token: Jwt): boolean {
    return !token?.header || !token?.payload || !token?.signature;
  }
}
