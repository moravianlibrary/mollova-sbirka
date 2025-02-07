import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable()
export class SearchService {
    loading = false;
    resultsSubject = new Subject<any>();
    results$ = this.resultsSubject.asObservable();

    constructor(private apiService: ApiService) { }

    search(query: string, sort: string) {
        this.loading = true;
        this.apiService.getSearchResults(query, sort).subscribe((data: any) => {
            this.resultsSubject.next(data);
            // console.log('Search results:', this.results$);
            this.loading = false;
        });
    }
}


