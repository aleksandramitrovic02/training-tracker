import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/enviroment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../auth/auth.models';
import { TokenStorageService } from './token-storage.services';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private tokens: TokenStorageService) {}

  register(req: RegisterRequest) {
    return this.http.post<void>(`${this.base}/register`, req);
  }

  login(req: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.base}/login`, req).pipe(
      tap(res => this.tokens.setTokens(res.accessToken, res.refreshToken))
    );
  }

  logout() {
    const refreshToken = this.tokens.getRefreshToken() ?? '';
    this.tokens.clear();
    return this.http.post<void>(`${this.base}/logout`, { refreshToken });
  }

  isLoggedIn(): boolean {
    return !!this.tokens.getAccessToken();
  }
}
