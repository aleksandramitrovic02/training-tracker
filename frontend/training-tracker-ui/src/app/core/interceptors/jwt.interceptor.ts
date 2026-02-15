import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokens: TokenStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.tokens.getAccessToken();
    if (!token) return next.handle(req);

    return next.handle(
      req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    );
  }
}
