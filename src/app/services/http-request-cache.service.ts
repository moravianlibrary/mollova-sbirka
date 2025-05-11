import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse } from '@angular/common/http';

const maxAge = 24 * 60 * 60 * 1000;

interface CacheEntry {
  key: string;
  response: HttpResponse<any>;
  lastRead: number;
}

@Injectable()
export class HttpRequestCache {
  private cache = new Map<string, CacheEntry>();

  get(key: string): HttpResponse<any> | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    const isExpired = entry.lastRead < Date.now() - maxAge;
    if (isExpired) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.response;
  }

  put(key: string, response: HttpResponse<any>): void {
    const entry: CacheEntry = {
      key,
      response,
      lastRead: Date.now()
    };
    this.cache.set(key, entry);
  }

  clear(): void {
    this.cache.clear();
  }
}
