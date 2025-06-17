import { HttpEvent, HttpProgressEvent } from '@angular/common/http';
import { map, OperatorFunction, pipe } from 'rxjs';

/*
 * @description
 * Transforms **HttpProgressEvent** into numeric value from **0** to **100**, representing upload progress in percents
 *
 * If **HttpEvent** is not of type **HttpProgressEvent** - returns **0**
 * */
export function toUploadProgress(): OperatorFunction<HttpEvent<unknown>, number> {
  return pipe(
    map((event) => event as HttpProgressEvent),
    map(({ loaded, total }: HttpProgressEvent) => {
      if (!loaded || !total) return 0;

      return Math.round(100 * (loaded / total));
    }),
  );
}
