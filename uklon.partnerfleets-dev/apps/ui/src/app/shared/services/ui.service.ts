import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentRef, Injectable, TemplateRef, Type, ViewContainerRef } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { DynamicComponentSidebarDirective } from '@ui/modules/shell/directives/dynamic-component-sidebar.directive';
import { defaultsDeep } from 'lodash';
import { Observable, map, BehaviorSubject } from 'rxjs';

import { MOBILE_BREAKPOINT, MOBILE_BREAKPOINT_HEIGHT } from '../consts';

export interface BackRouteData {
  url: string[];
  extras?: NavigationExtras;
}

export interface ShellConfig {
  header: {
    branding?: boolean;
    title: boolean;
    customTitle?: string | null;
    /**
     * @description translate pipe parameter should be named data for this to work ("My key": "Hello {{data}}")
     */
    customTitleData?: string | null;
    subtitle?: string | null;
    backNavigationButton: boolean;
    backRoute?: BackRouteData | null;
    hideTitleOnMobile?: boolean;
    template?: TemplateRef<unknown> | null;
    templateContext?: unknown;
  };
}

export const DEFAULT_SHELL_CONFIG: ShellConfig = {
  header: {
    branding: true,
    title: true,
    customTitle: null,
    subtitle: null,
    backNavigationButton: false,
    backRoute: null,
    hideTitleOnMobile: false,
    template: null,
    templateContext: null,
  },
};

export type FullScreenMode = 'full' | 'normal';

@Injectable({ providedIn: 'root' })
export class UIService {
  private readonly headerTitle$ = new BehaviorSubject<string>('');
  private readonly shellConfig$ = new BehaviorSubject<ShellConfig>(DEFAULT_SHELL_CONFIG);
  private readonly fullscreenMode$ = new BehaviorSubject<FullScreenMode>('normal');
  private dynamicComponentSidebar: DynamicComponentSidebarDirective;

  constructor(private readonly observer: BreakpointObserver) {}

  public get config$(): Observable<ShellConfig> {
    return this.shellConfig$.asObservable();
  }

  public get title$(): Observable<string> {
    return this.headerTitle$.asObservable();
  }

  public get fullscreen$(): Observable<FullScreenMode> {
    return this.fullscreenMode$.asObservable();
  }

  public setConfig(config: Partial<ShellConfig>): void {
    this.shellConfig$.next(defaultsDeep({}, config, DEFAULT_SHELL_CONFIG));
  }

  public resetConfig(): void {
    this.shellConfig$.next(DEFAULT_SHELL_CONFIG);
  }

  public setTitle(title: string): void {
    this.headerTitle$.next(title);
  }

  public toggleFullScreenMode(enabled: boolean): void {
    this.fullscreenMode$.next(enabled ? 'full' : 'normal');
  }

  public setDynamicComponentSidebar(sidebar: DynamicComponentSidebarDirective): void {
    this.dynamicComponentSidebar = sidebar;
  }

  public openDynamicComponent<T>(
    type: Type<T>,
    vcr: ViewContainerRef,
    params?: {
      clearPrevious: boolean;
    },
  ): ComponentRef<T> {
    return this.dynamicComponentSidebar.open(type, vcr, params);
  }

  public async toggleDynamicComponentSidebar(): Promise<void> {
    return this.dynamicComponentSidebar.toggle();
  }

  /**
   *
   * @param breakpointPx format is `${number}px` | deafault value - 767px
   */
  public breakpointMatch(breakpointPx = MOBILE_BREAKPOINT): Observable<boolean> {
    return this.observer.observe([`(max-width: ${breakpointPx})`]).pipe(map(({ matches }) => matches));
  }

  public breakpointMatchWidthHeight(
    breakpointWidthPx = MOBILE_BREAKPOINT,
    breakpointHeightPx = MOBILE_BREAKPOINT_HEIGHT,
  ): Observable<boolean> {
    return this.observer
      .observe([`(max-width: ${breakpointWidthPx})`, `(max-height: ${breakpointHeightPx})`])
      .pipe(map(({ matches }) => matches));
  }
}
