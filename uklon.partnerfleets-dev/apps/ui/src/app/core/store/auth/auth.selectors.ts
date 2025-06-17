import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '@ui/core/store/auth/auth.reducer';

export const getAuthStore = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(getAuthStore, (authStore: AuthState) => authStore?.user);

export const getAccessToken = createSelector(getAuthStore, (authStore: AuthState) => authStore?.user?.accessToken);

export const getIsLoggedInUser = createSelector(getAccessToken, (token) => !!token);

export const getRefreshToken = createSelector(getAuthStore, (authStore: AuthState) => authStore?.user?.refreshToken);

export const getSignInLoading = createSelector(getAuthStore, (authStore: AuthState) => authStore.loading);
