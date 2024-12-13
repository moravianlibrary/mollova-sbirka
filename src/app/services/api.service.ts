import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    apiUrl = 'https://api.kramerius.mzk.cz/search/api/client/v7.0/search?';

    doGet(url: string): Observable<Object> {
        return this.http.get(encodeURI(url)).pipe(catchError(this.handleError));
    }
    private handleError(error: Response) {
        if (error.status === 404) {
            return throwError(() => 'Not found');
        } else if (error.status === 401 || error.status === 403) {
            return throwError(() => 'Unauthorized');
        }
        return throwError(() => 'Server error');
    }
    getCollection(pid: string): Observable<Object> {
        return this.doGet(
            `${this.apiUrl}q=pid:"${pid}"`
        );
    }
    getCollectionChildren(pid: string): Observable<Object> {
        return this.doGet(
            `${this.apiUrl}q=*:*&fq=(in_collections.direct:"${pid}")&fl=pid,model,authors,titles.search,title.search,root.title,date.str,title.search_*,collection.desc,collection.desc_*&rows=1000`
        );
    }

    // q=*:*&fq=(in_collections.direct:"uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a")&fl=pid,model,authors,titles.search,title.search,root.title,date.str,title.search_*,collection.desc,%20collection.desc_*

}