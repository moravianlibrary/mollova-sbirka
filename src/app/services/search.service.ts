import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable()
export class SearchService {
    loading: boolean = false;
    resultsSubject = new Subject<any>();
    results$ = this.resultsSubject.asObservable();

    constructor(private apiService: ApiService) { }

    search(query: string, sort: string) {
        this.loading = true;
        console.log('Hledám:', query, sort);
        this.apiService.getSearchResults(query, sort).subscribe({
            next: (data: any) => {
                this.resultsSubject.next(data);
                // console.log('Přijatá data z API:', data);
                this.loading = false;
            },
            error: (error) => {
                console.error('Chyba při načítání dat:', error);
                this.loading = false; // Ať se stránka ne zasekne
            }
        });
        
    }
}


