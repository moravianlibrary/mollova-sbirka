import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler,
  HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpRequestCache } from './http-request-cache.service';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: HttpRequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return next.handle(req);
    }

    // Klíč obsahuje i tělo pro POST
    const cacheKey = this.createCacheKey(req);

    const cached = this.cache.get(cacheKey);
    if (cached) {
      return of(cached);
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.put(cacheKey, event);
        }
      })
    );
  }

  private createCacheKey(req: HttpRequest<any>): string {
    const bodyString = req.body ? JSON.stringify(req.body) : '';
    return `${req.method}::${req.urlWithParams}::${bodyString}`;
  }
}
