import { ComponentRef, Directive, OnInit, Type, ViewContainerRef } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UIService } from '@ui/shared';

@Directive({
  selector: '[upfDynamicComponentSidebar]',
  standalone: true,
})
export class DynamicComponentSidebarDirective implements OnInit {
  constructor(
    private readonly drawer: MatDrawer,
    private readonly viewContainerRef: ViewContainerRef,
    private readonly uiService: UIService,
  ) {}

  public ngOnInit(): void {
    this.uiService.setDynamicComponentSidebar(this);
    this.drawer.position = 'end';
    this.drawer.autoFocus = false;
  }

  public async toggle(): Promise<void> {
    await this.drawer.toggle();
    if (!this.drawer?.opened) {
      this.viewContainerRef.clear();
    }
  }

  public close(): void {
    this.drawer.close();
    this.viewContainerRef.clear();
  }

  public open<T>(type: Type<T>, vcr: ViewContainerRef, params?: { clearPrevious: boolean }): ComponentRef<T> {
    const component = vcr.createComponent(type, { injector: this.viewContainerRef.injector });

    if (params?.clearPrevious) {
      this.viewContainerRef.clear();
    }

    this.viewContainerRef.insert(component.hostView);

    this.drawer.open();

    return component;
  }
}
