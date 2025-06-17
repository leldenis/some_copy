import { Data, Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { AccountState } from '@ui/core/store/account/account.reducer';
import { AuthState } from '@ui/core/store/auth/auth.reducer';
import { ReferencesState } from '@ui/core/store/references/references.reducer';
import { RootState } from '@ui/core/store/root/root.reducer';

export interface RouterUrlState {
  url: string;
  params: Params;
  queryParams: Params;
  data: Data;
  fragment: string;
}

export interface AppState {
  root: RootState;
  auth: AuthState;
  account: AccountState;
  references: ReferencesState;
  router: RouterReducerState<RouterUrlState>;
}
