import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class SearchService {
  resultsSubject = new Subject<any>();
  results$ = this.resultsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  search(query: string, sort: string): Observable<any> {
    return this.apiService.getSearchResults(query, sort).pipe(
      tap(data => this.resultsSubject.next(data))
    );
  }
}



