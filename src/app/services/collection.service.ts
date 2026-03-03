import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, mergeMap, Observable, of, Subject, switchMap, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CollectionService {
    mainCollectionUUID = 'uuid:9b190c71-5a2c-44fa-bc8a-b6c5b056c01a';
    collectionStructure = [];
    collectionIndex: { [key: string]: string } = {};

    private collectionStructureSubject = new BehaviorSubject<any>(null); // Default null
    collectionStructure$ = this.collectionStructureSubject.asObservable(); // Public observable
    private collectionIndexSubject = new BehaviorSubject<any>(null); // Default null
    collectionIndex$ = this.collectionIndexSubject.asObservable(); // Public observable

    private readonly jsonMollStructure = 'assets/docs/moll-structure-edit.json';
    private readonly jsonMollIndex = 'assets/docs/moll-index.json';

    private siblingsSubject = new BehaviorSubject<any[]>([]);
    siblings$ = this.siblingsSubject.asObservable();

    private contextSource = new BehaviorSubject<any>(null);
    context$ = this.contextSource.asObservable();

    constructor(private apiService: ApiService,
                private http: HttpClient
    ) { }

    // Observable pro hover události z mapy do menu
    private hoverFromMapSubject = new Subject<string | null>();
    hoverFromMap$ = this.hoverFromMapSubject.asObservable();

    // Observable pro hover události z menu do mapy
    private hoverFromMenuSubject = new Subject<string | null>();
    hoverFromMenu$ = this.hoverFromMenuSubject.asObservable();

    // Emitování hover událostí z mapy
    emitHoverFromMap(areaName: string | null) {
        this.hoverFromMapSubject.next(areaName);
    }

    // Emitování hover událostí z menu
    emitHoverFromMenu(areaName: string | null) {
        this.hoverFromMenuSubject.next(areaName);
    }

    init(params?: any) {
        // Init collection
    }

    loadCollectionStructure() {
        this.getCollectionStructureFromJSON().subscribe((data: any) => {
            if (data) {
                this.collectionStructureSubject.next(data);
                this.collectionStructure = data;
                this.getCollectionIndexFromJSON().subscribe((data: any) => {
                    this.collectionIndexSubject.next(data);
                    this.collectionIndex = data;
                });
            }
        });
    }

    getChildrenByPidWithDetails(pid: string): Observable<any[]> {
        return this.getCollectionStructureFromJSON().pipe(
            map((data: any[]) => {
                const findChildren = (items: any[], pid: string): any[] | null => {
                    for (const item of items) {
                        if (item.pid === pid) {
                            if (item.children) {
                                return item.children.filter((child: any) => child.model !== 'manuscript');
                            }
                            if (item.children_catalogs) {
                                return item.children_catalogs || [];
                            }
                            // return item.children || item.children_catalogs || [];
                        }
                        if (item.children && item.children.length > 0) {
                            const found = findChildren(item.children, pid);
                            if (found) {
                                return found;
                            }
                        }
                    }
                    return null;
                };
                return findChildren(data, pid) || [];
            }),
            mergeMap((children: any[]) => {
                // Pro každé dítě zavolej getCollection(pid)
                const detailedChildren$ = children.map(child =>
                    forkJoin({
                        collectionDetails: this.getCollection(child.pid).pipe(
                            map((res: any) => res?.response?.docs?.[0] || {})
                        )
                    }).pipe(
                        map(({ collectionDetails }) => ({
                            ...child,
                            collectionDetails
                        }))
                    )
                );
                // Sloučí všechny observables do jednoho
                if (detailedChildren$.length === 0) {
                    return of([]);
                }
                return forkJoin(detailedChildren$);
            })
        );
    }

    getCollectionChildren(pid: string): Observable<any[]> {
        return this.apiService.getCollectionChildren(pid).pipe(
            map((data: any) => {
                const docs = data?.response?.docs || [];
                return docs.filter((item: any) => item['model'] !== 'manuscript');
            }),
            mergeMap((children: any[]) => {
                if (children.length === 0) return of([]);

                const pids = children.map(child => child.pid);

                return this.apiService.getElasticRecordsByPids(pids).pipe(
                    map((res: any) => {
                        const elasticMap = (res?.hits?.hits || []).reduce((acc: any, hit: any) => {
                            const source = hit._source || {};
                            acc[source.pid] = source;
                            return acc;
                        }, {});

                        return children.map(child => ({
                            ...child,
                            collectionDetails: child, // použijme data, která už máme
                            elasticDetails: elasticMap[child.pid] || {}
                        }));
                    })
                );
            }),
            tap((detailedChildren: any[]) => {
                const sortedSiblings = detailedChildren.sort((a: any, b: any) =>
                    a['shelf_locators']?.[0]?.localeCompare(b['shelf_locators']?.[0]) ?? 0
                );
                this.setSiblings(sortedSiblings);
            })
        );
    }


    getPagesByPid(pid: string): Observable<Object> {
        return this.apiService.getPages(pid);
    }

    setContext(context: any) {
        console.log('setting context', context);
        this.contextSource.next(context);
    }
    getCollectionStructureFromJSON(): Observable<any> {
        return this.http.get<any>(this.jsonMollStructure);
    }
    getCollectionIndexFromJSON(): Observable<any> {
        return this.http.get<any>(this.jsonMollIndex);
    }
    getCollection(pid: string): Observable<Object> {
        return this.apiService.getCollection(pid);
    }

    getCollectionStructure(pid: string): Observable<any> {
        const collectionIndex: { [key: string]: string } = {};

        return this.getCollectionChildren(pid).pipe(
            switchMap((data: any) => {
                let collectionData = data['response']['docs'];

                let collectionStructure$: Observable<any>[] = collectionData.map((item: any) => {
                    console.log('Item:', item);
                    let collectionItem = {
                        pid: item['pid'],
                        title: item['title.search'] ? item['title.search'] : '',
                        title_en: item['title.search_eng'] ? item['title.search_eng'][0] : '',
                        title_de: item['title.search_ger'] ? item['title.search_ger'][0] : '',
                        model: item['model'] || '',
                        children: [] as any[]
                    };

                    // Použití tap pro přidání do indexu
                    return this.getCollectionChildren(item['pid']).pipe(
                        tap(() => {
                            collectionIndex[collectionItem.pid] = collectionItem.title;
                        }),
                        switchMap((childrenData: any) => {
                            let children: Observable<any>[] = childrenData['response']['docs'].map((child: any) => {
                                let childItem = {
                                    pid: child['pid'],
                                    title: child['title.search'] ? child['title.search'] : '',
                                    title_en: child['title.search_eng'] ? child['title.search_eng'][0] : '',
                                    title_de: child['title.search_ger'] ? child['title.search_ger'][0] : '',
                                    model: child['model'] || '',
                                    children: [] as any[]
                                };

                                return this.getCollectionChildren(child['pid']).pipe(
                                    tap(() => {
                                        collectionIndex[childItem.pid] = childItem.title;
                                    }),
                                    map((grandChildrenData: any) => {
                                        childItem.children = grandChildrenData['response']['docs'].map((grandChild: any) => {
                                            collectionIndex[grandChild['pid']] = grandChild['title.search'] ? grandChild['title.search'] : '';
                                            return {
                                                pid: grandChild['pid'],
                                                title: grandChild['title.search'] ? grandChild['title.search'] : '',
                                                title_en: grandChild['title.search_eng'] ? grandChild['title.search_eng'][0] : '',
                                                title_de: grandChild['title.search_ger'] ? grandChild['title.search_ger'][0] : '',
                                                model: grandChild['model'] || ''
                                            };
                                        });
                                        return childItem;
                                    })
                                );
                            });

                            return forkJoin(children).pipe(
                                map((resolvedChildren) => {
                                    collectionItem.children = resolvedChildren;
                                    return collectionItem;
                                })
                            );
                        })
                    );
                });

                return forkJoin(collectionStructure$).pipe(
                    map((collectionStructure) => ({
                        collectionStructure,
                        collectionIndex
                    }))
                );
            })
        );
    }

    setSiblings(siblings: any[]): void {
        this.siblingsSubject.next(siblings);
    }

    getParentPid(pid: string): Observable<any> {
        return this.getCollection(pid).pipe(
            map((data: any) => {
                let pids = data['response']['docs'][0]['in_collections.direct'];
                return this.getProperPid(pids);
            })
        );
    }

    clearSiblings(): void {
        this.siblingsSubject.next([]);
    }

    getProperPid(pids: string[]): string {
        if (pids && pids.length === 1) {
          return pids[0];
        } else if (pids && pids.length > 1) {
          for (let pid of pids) {
            if (this.collectionIndex[pid]) {
              return pid;
            }
          }
        }
        return '';
    }

    getElasticDetailsToMap(pid: string): Observable<any> {
        return this.apiService.getElasticRecordByPid(pid);
    }

    // Uložení dat do souboru
    saveDataAsFile(data: any): void {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        window.URL.revokeObjectURL(url);
    }

}
