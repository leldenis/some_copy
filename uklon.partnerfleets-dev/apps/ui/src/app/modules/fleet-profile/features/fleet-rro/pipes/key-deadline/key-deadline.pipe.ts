import { Pipe, PipeTransform } from '@angular/core';

import { isNumber } from '@uklon/angular-core';

export interface KeyDeadlineDto {
  expired: boolean;
  expireSoon: boolean;
}

@Pipe({
  name: 'keyDeadline',
  standalone: true,
})
export class KeyDeadlinePipe implements PipeTransform {
  public transform(expirationTime?: number, daysLeft = 30): KeyDeadlineDto {
    if (!isNumber(expirationTime)) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const secondsInDay = 60 * 60 * 24;
    const daysLeftInSeconds = daysLeft * secondsInDay;

    if (expirationTime < currentTime) {
      return { expired: true, expireSoon: false };
    }

    return { expired: false, expireSoon: expirationTime - currentTime <= daysLeftInSeconds };
  }
}
