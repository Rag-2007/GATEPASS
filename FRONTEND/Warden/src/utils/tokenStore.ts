import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'warden_access_token',
  refreshToken: 'warden_refresh_token',
  userId: 'warden_user_id',
};

export async function saveTokens(
  accessToken: string,
  refreshToken: string,
  userId: string,
): Promise<void> {
  await SecureStore.setItemAsync(KEYS.accessToken, accessToken);
  await SecureStore.setItemAsync(KEYS.refreshToken, refreshToken);
  await SecureStore.setItemAsync(KEYS.userId, userId);
}

export async function getAccessToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.accessToken);
}

export async function getRefreshToken(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.refreshToken);
}

export async function getUserId(): Promise<string | null> {
  return await SecureStore.getItemAsync(KEYS.userId);
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.accessToken);
  await SecureStore.deleteItemAsync(KEYS.refreshToken);
  await SecureStore.deleteItemAsync(KEYS.userId);
}

