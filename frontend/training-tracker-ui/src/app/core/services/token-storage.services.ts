import { Injectable } from '@angular/core';

const ACCESS = 'access_token';
const REFRESH = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(ACCESS, accessToken);
    localStorage.setItem(REFRESH, refreshToken);
  }

  clear() {
    localStorage.removeItem(ACCESS);
    localStorage.removeItem(REFRESH);
  }
}
