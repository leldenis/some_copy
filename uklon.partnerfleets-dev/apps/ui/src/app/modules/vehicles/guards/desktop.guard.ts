import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@nestjs/common';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@ui/core/services/toast.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DesktopGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly translateService: TranslateService,
    private readonly platform: Platform,
  ) {}

  public canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    const isMobile = this.platform.ANDROID || this.platform.IOS;

    if (!isMobile) {
      const message = this.translateService.instant('PhotoControl.Panel.DesktopTooltip');
      this.toastService.warn(message);
      this.router.navigate(['./']);
    }

    return isMobile;
  }
}
