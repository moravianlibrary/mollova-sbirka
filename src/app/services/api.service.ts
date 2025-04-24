import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ApiService {

    constructor(private http: HttpClient) { }

    k7SearchUrl = environment.krameriusBaseUrl + '/api/client/v7.0/search';
    esSearchUrl = '/elasticsearch/moll/_search';

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
            `${this.k7SearchUrl}?q=pid:"${pid}"`
        );
    }
    getCollectionChildren(pid: string): Observable<Object> {
        return this.doGet(
            `${this.k7SearchUrl}?q=*:*&fq=(in_collections.direct:"${pid}")&fl=pid,model,authors,titles.search,title.search,root.title,date.str,title.search_*,collection.desc,collection.desc_*,shelf_locators&rows=1000`
        );
    }
    getPages(pid: string): Observable<Object> {
        return this.doGet(
            `${this.k7SearchUrl}?q=own_parent.pid:"${pid}"&fl=pid,model,page.type,page.number&sort=rels_ext_index.sort asc&rows=4000&start=0`
        );
    }
    getSearchResults(query: string, sort: string): Observable<Object> {
        return this.doGet(
            `${this.k7SearchUrl}?${query}&fl=pid,model,authors,titles.search,title.search,root.title,coords.bbox.corner_ne,coords.bbox.center,coords.bbox.corner_sw,date.str,date_range_end.year,date_range_start.year&rows=100${sort}`
        );
    }
    getElasticSearchResults(query: string): Observable<Object> {
        return this.doGet(
            `${this.esSearchUrl}?${query}`
        );
    }
    getElasticRecordByPid(pid: string): Observable<Object> {
        const body = {
            query: {
                match: {
                    _id: pid
                }
            }
        };
        return this.http.post(this.esSearchUrl, body);
    }

    //https://api.kramerius.mzk.cz/search/api/client/v7.0/search?fl=pid,accessibility,model,title.search,licenses,contains_licenses,licenses_of_ancestors,page.type,page.number,page.placement,track.length&q=own_parent.pid:%22uuid:e1db8d4c-f39c-4599-b71a-5e8cd634a8af%22&sort=rels_ext_index.sort%20asc&rows=4000&start=0
    // q=*:*&fq=(in_collections.direct:"uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a")&fl=pid,model,authors,titles.search,title.search,root.title,date.str,title.search_*,collection.desc,%20collection.desc_*


    // MOLLOVA MAPOVA SBIRKA
    // https://www.digitalniknihovna.cz/mzk/collection/uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a

    // IN COLLECTIONS a MODEL MAPA NEBO GRAFIKA
    // https://api.kramerius.mzk.cz/search/api/client/v7.0/search?q=*:*&fq=(in_collections:%22uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a%22)%20AND%20(model:graphic OR model:map)&fl=pid,model,authors,titles.search,title.search,root.title,coords.bbox.corner_ne,coords.bbox.center,coords.bbox.corner_sw,date.str&sort=created%20desc&rows=100&start=0


}