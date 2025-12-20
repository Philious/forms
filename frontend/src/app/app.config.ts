import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { HttpInterceptorFn, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

const xsrfInterceptor: HttpInterceptorFn = (req, next) => {
  const token = document.cookie
    .split('; ')
    .find(c => c.startsWith('FORMS_COOKIE='))
    ?.split('=')[1];

  if (token) {
    req = req.clone({
      setHeaders: { 'X-Custom-Xsrf-Header': token },
    });
  }

  return next(req);
};

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(routes), provideHttpClient(withFetch(), withInterceptors([xsrfInterceptor]))],
};
