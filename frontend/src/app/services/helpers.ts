import { HttpClient } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

export function bindToSignal<T>(obs$: Observable<T>, signal: WritableSignal<T | null>): void {
  obs$.subscribe({
    next: value => signal.set(value),
    error: err => {
      console.error('Request failed', err);
      signal.set(null);
    },
  });
}

export type ApiObserverOptions<T> = {
  next?: (value: T) => void;
  error?: (err: unknown) => void;
  complete?: () => void;
};

export function createGetHelper(client: HttpClient, baseUrl: string): <T>(url: string, options: ApiObserverOptions<T>) => void {
  const getter = <T>(url: string, options: ApiObserverOptions<T>): void => {
    (
      client.get<T>(`${baseUrl}${url}`, {
        withCredentials: true,
      }) as Observable<T>
    ).subscribe({
      next: options.next,
      error: options.error,
      complete: options.complete,
    });
  };
  return getter;
}

export function createPostHelper(client: HttpClient, baseUrl: string): <T>(url: string, value: T, options?: ApiObserverOptions<unknown>) => void {
  const poster = <T>(url: string, value: T, options?: ApiObserverOptions<unknown>): void => {
    client
      .post(`${baseUrl}${url}`, value, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: options?.next,
        error: options?.error,
        complete: options?.complete,
      });
  };
  return poster;
}

export function createDeleteHelper(client: HttpClient, baseUrl: string): (url: string, id: string, options?: ApiObserverOptions<unknown>) => void {
  const deleter = (url: string, id: string, options?: ApiObserverOptions<unknown>): void => {
    (
      client.delete(`${baseUrl}/api/delete${url}${id}`, {
        withCredentials: true,
      }) as Observable<unknown>
    ).subscribe({
      next: options?.next,
      error: options?.error,
      complete: options?.complete,
    });
  };
  return deleter;
}
