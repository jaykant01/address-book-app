import { HttpInterceptorFn } from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {inject} from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);

  const authToken = authService.getToken();
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' +authToken)
    });

    return next(authReq);
  }
  return next(req);
};
