import { IdentityDto } from '@data-access';
import { createAction, props } from '@ngrx/store';
import { UserDto } from '@ui/core/models/user.dto';
import { AuthFormDto } from '@ui/modules/auth/models/auth-form.dto';

const tag = '[auth]';

export const authActions = {
  login: createAction(`${tag} login`, props<AuthFormDto>()),
  loginSuccess: createAction(`${tag} login success`, props<IdentityDto>()),

  refreshToken: createAction(`${tag} refresh token`, props<IdentityDto>()),

  logout: createAction(`${tag} logout`),

  setUser: createAction(`${tag} set user`, props<UserDto>()),
  getUser: createAction(`${tag} get user`),

  loginFailed: createAction(`${tag} login failed`, props<{ status: number; subCode?: number; message?: string }>()),
};
