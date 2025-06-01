import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';

export class Api {
  protected readonly _http = inject(HttpClient);
  protected API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
    factory: () => 'http://localhost:3000',
  });
  constructor() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this._http.get(`/api/user`, { withCredentials: true, headers });
  }
}
