import { Observable } from 'rxjs';

export interface CanDeactivateComponent {
  canDeactivate: () => boolean | Observable<boolean>;
}
