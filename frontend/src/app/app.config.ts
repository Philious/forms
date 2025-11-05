/*
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'FORMS_COOKIE',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    )
  ]
};
*/
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';
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
  providers: [provideRouter(routes), provideAnimations(), provideHttpClient(withFetch(), withInterceptors([xsrfInterceptor]))],
};
