import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable()
export class GoogleTagManagerService {
  public static readonly uniqueGoogleTagScriptId = 'pf-google-tag-manager';

  private readonly renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly documentRef: Document,
    private readonly zone: NgZone,
    private readonly rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  public install(containerId: string): void {
    if (!containerId) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.appendGtmScript(GoogleTagManagerService.uniqueGoogleTagScriptId, containerId);
    });
  }

  protected appendGtmScript(scriptId: string, containerId: string): void {
    // eslint-disable-next-line unicorn/prefer-query-selector
    if (this.documentRef.getElementById(scriptId)) {
      return;
    }

    const gtmScriptElement = this.renderer.createElement('script');
    gtmScriptElement.id = scriptId;
    gtmScriptElement.text = this.buildTagManagerScript(containerId);
    this.renderer.appendChild(this.documentRef.body, gtmScriptElement);
  }

  private readonly buildTagManagerScript = (containerId: string): string =>
    `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${containerId}');`;
}
