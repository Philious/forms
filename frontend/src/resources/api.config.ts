/*
@Injectable({ providedIn: 'root' })
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

  request<T, R>(url: string, method: 'GET' | 'POST' | 'DELETE' | 'PUT', body?: T, signal?: AbortSignal): Promise<R> {
    return fetch(url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      signal,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      if (res.statusText === 'No Content') return true;
      const response = res.json();
      return response;
    });
  }
}
*/
