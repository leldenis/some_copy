import { inject, InjectionToken, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { toSnakeCase } from '@ui/shared';
import { filter, map } from 'rxjs/operators';

const WORKSPACE = /\/workspace\//gi;
const GUID = /\/([\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12})/gi;
const GUID_NO_DASH = /\/[\da-f]{32}/gi;

export function getAnalyticsPage(url: string): string {
  const [path, rest] = url.split('?');
  const [basePath, possibleFragment] = path.split('#');
  const fragment = rest?.split('#')?.[1] ?? possibleFragment ?? '';
  const pageStr = basePath.replace(WORKSPACE, '').replace(GUID, '').replace(GUID_NO_DASH, '');

  return toSnakeCase([...pageStr.split('/'), toSnakeCase(fragment)].filter(Boolean).join('_'));
}

export const ANALYTICS_PAGE = new InjectionToken<Signal<string>>('AnalyticsPage', {
  providedIn: 'root',
  factory: () => {
    const router = inject(Router);

    return toSignal(
      router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => getAnalyticsPage(router.url)),
      ),
    );
  },
});
