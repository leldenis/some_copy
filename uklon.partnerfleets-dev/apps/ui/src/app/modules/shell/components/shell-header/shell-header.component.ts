import { NgClass, NgOptimizedImage, NgTemplateOutlet, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BackRouteData, CountMaskPipe, FullScreenMode, ShellConfig } from '@ui/shared';

@Component({
  selector: 'upf-shell-header',
  standalone: true,
  imports: [
    MatIcon,
    MatButton,
    MatAnchor,
    MatIconButton,
    MatMiniFabButton,
    NgClass,
    NgOptimizedImage,
    NgTemplateOutlet,
    TranslateModule,
    CountMaskPipe,
  ],
  templateUrl: './shell-header.component.html',
  styleUrl: './shell-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellHeaderComponent {
  @Output() public readonly openSidebar = new EventEmitter<void>();
  @Output() public readonly openNotificationsSidebar = new EventEmitter<number>();

  public title = input<string>();
  public config = input<ShellConfig>();
  public isMobileView = input<boolean>();
  public notificationsCount = input<number>();
  public showNotificationsBtn = input<boolean>();
  public fullScreenMode = input<FullScreenMode>();
  public customNotificationsCount = input<number>();

  constructor(
    private readonly router: Router,
    private readonly location: Location,
  ) {}

  public onNavigateBack(backRoute: BackRouteData): void {
    if (backRoute) {
      this.router.navigate(backRoute.url, backRoute.extras);
      return;
    }

    this.router.lastSuccessfulNavigation?.previousNavigation ? this.location.back() : this.router.navigate(['../']);
  }
}
