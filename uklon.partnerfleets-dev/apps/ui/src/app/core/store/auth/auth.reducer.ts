import { createReducer, on } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { authActions } from '@ui/core/store/auth/auth.actions';

export interface AuthState {
  loading: boolean;
  user: UserDto;
}

export const initialState: AuthState = {
  loading: false,
  user: null,
};

export const authReducer = createReducer(
  initialState,

  on(authActions.login, (state) => ({
    ...state,
    loading: true,
  })),

  on(authActions.loginSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(authActions.loginFailed, (state) => ({
    ...state,
    loading: false,
  })),

  on(authActions.logout, () => ({
    ...initialState,
  })),

  on(authActions.setUser, (state, user) => ({
    ...state,
    user,
  })),
);
