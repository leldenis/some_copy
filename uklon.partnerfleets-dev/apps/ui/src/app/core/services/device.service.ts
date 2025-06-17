import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

export enum UklEmbeddedPlatform {
  ANDROID = 'UklAndroid',
  IOS = 'UklIos',
}

export enum UklEmbeddedEvent {
  CLOSE = 'close',
}

interface EmbeddedWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  DriverApp?: {
    isMobile: () => boolean;
    close: () => void;
  };
  iosApp?: boolean;
  webkit?: {
    messageHandlers: {
      transferMethod: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        postMessage: (data?: any) => void;
      };
    };
  };
}

@Injectable()
export class DeviceService {
  private readonly userAgent: string;
  private readonly defaultView: EmbeddedWindow;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) platformId: string,
  ) {
    if (isPlatformBrowser(platformId) && this.document?.defaultView) {
      this.defaultView = this.document.defaultView;
      this.userAgent = this.document.defaultView.navigator.userAgent;
    }
  }

  public isIos(): boolean {
    return /iPad|iPhone|iPod/.test(this.userAgent);
  }

  public isAndroid(): boolean {
    return /android/i.test(this.userAgent);
  }

  public getEmbeddedPlatform(): UklEmbeddedPlatform | null {
    if (!this.defaultView) {
      return null;
    }

    if (this.defaultView?.iosApp) {
      return UklEmbeddedPlatform.IOS;
    }

    return this.defaultView?.DriverApp?.isMobile() ? UklEmbeddedPlatform.ANDROID : null;
  }

  public sendEvent(evt: UklEmbeddedEvent): void {
    const embeddedPlatform = this.getEmbeddedPlatform();

    if (!embeddedPlatform) {
      throw new Error('Sending commands is only supported for embedded systems');
    }

    if (evt !== UklEmbeddedEvent.CLOSE) {
      // Go to switch block if their more than one event.
      throw new Error('Method not implemented.');
    }

    if (embeddedPlatform === UklEmbeddedPlatform.ANDROID) {
      this.defaultView?.DriverApp?.close();
    } else if (embeddedPlatform === UklEmbeddedPlatform.IOS) {
      this.defaultView?.webkit?.messageHandlers?.transferMethod?.postMessage('close');
    }
  }
}
